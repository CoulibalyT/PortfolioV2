# portfolio-sync — Retour d'expérience & pistes d'amélioration

Document de feedback rédigé après utilisation réelle de `portfolio-sync` pour ajouter le projet **Intake (INSEAD)** au portfolio.

> **Mise à jour 2026-04-22** : la version **1.1.0** publiée le même jour a livré **5 des 8 améliorations** proposées dans la première rédaction de ce doc, et fixé le bug `--help`. **La migration vers 1.1.0 a été appliquée au repo** (voir section 6). Les sections ci-dessous sont annotées en conséquence (✅ résolu / ⏳ partiel / ❌ encore ouvert).

---

## 1. Contexte d'usage

- **App ciblée** : `https://it-assistance-jj.vercel.app` (Next.js 15, NextAuth v5, App Router, app interne INSEAD)
- **Pages capturées** : 7 (mix public + auth + admin)
- **Auth** : kiosque 2 étapes — clic sur une carte profil "IT Administrator" → input `#password-input` apparaît → saisie du mot de passe → bouton "Sign in"
- **Intégration testée** : `1.0.0` puis `1.1.0`

---

## 2. Bugs rencontrés (en 1.0.0)

### 2.1 ✅ `portfolio-sync capture --help` reste bloqué — **fixé en 1.1.0**

**Cause** : `bin/cli.js` chargeait `require('../src/capturer')` au top-level → import de `puppeteer` (lourd) avant même le parsing de `--help`.

**Fix livré en 1.1.0** : lazy-require — `captureProjects` et `loadConfig` ne sont importés que dans le callback de l'action. Confirmé à la main :
```bash
$ npx portfolio-sync capture --help   # < 1s, affiche bien l'usage
```

### 2.2 ✅ Asymétrie dans la résolution des variables d'environnement — **fixée en 1.1.0**

`auth.script` (type `custom`) ne passait pas par `resolveEnvVar()`. Une nouvelle fonction `resolveEnvVarsInString()` (introduite en 1.1.0) remplace toutes les occurrences `${VAR}` dans le script avant `page.evaluate()`.

```js
// node_modules/portfolio-sync/src/auth.js (1.1.0)
const resolvedScript = resolveEnvVarsInString(script);
await page.evaluate(resolvedScript);
```

→ Le wrapper temporaire `scripts/sync-intake.mjs` qui faisait `replaceAll('__INTAKE_PASSWORD__', ...)` a été supprimé suite à la migration. Aujourd'hui, l'auth lit `process.env.INTAKE_PASSWORD` directement via le `context.env` injecté par `scriptFile`.

### 2.3 ⏳ Échecs silencieux non détectés — **partiellement adressé en 1.1.0**

Plusieurs pages avaient produit des screenshots "techniquement réussis" mais inutilisables :

| Page | Symptôme | Détection (1.0.0) | Détection (1.1.0) |
|------|----------|-------------------|-------------------|
| `/intake/queue-decision` | Screenshot 4.9 KB — juste un spinner | ❌ aucune | ❌ aucune |
| `/intake/questions` | Identique à `/intake` (redirect interne) | ❌ aucune | ✅ via `expectedUrlPattern` |
| `/manager` (1er run) | Page entière de **signin** au lieu du dashboard | ❌ aucune | ✅ via `expectedUrlPattern` |

→ Les redirects de routes protégées sont désormais attrapables. Les "pages chargées mais vides" (juste un spinner React, "no data" empty state) restent non détectées — voir 4.7 ci-dessous.

---

## 3. Friction d'ergonomie

### 3.1 ✅ Script custom en string JSON — **résolu en 1.1.0 via `scriptFile`**

Avant, écrire un script async multi-ligne dans un champ JSON était pénible (échappement, une seule ligne, pas de lint). La 1.1.0 introduit `scriptFile` qui charge un module ES/CJS exportant `(page, context) => Promise<void>` :

```json
"auth": {
  "type": "custom",
  "navigateTo": "/auth/signin",
  "scriptFile": "./scripts/auth/intake.cjs",
  "waitFor": 1000
}
```

```cjs
// scripts/auth/intake.cjs
module.exports = async (page, { env }) => {
  // lintable, testable, accès direct à process.env via context.env
  await page.waitForSelector('#password-input');
  // ... clic admin, type password, submit, attendre redirect
};
```

> ⚠️ **Gotcha rencontré pendant la migration** : si le repo a `"type": "module"` dans `package.json`, un fichier `.js` est traité comme ESM et le `module.exports = ...` plante (`ReferenceError: module is not defined`). Deux solutions : extension **`.cjs`** (ce que j'ai fait), ou écrire en ESM avec `export default`. Le code de chargement de portfolio-sync ([`auth.js:166-185`](node_modules/portfolio-sync/src/auth.js)) gère bien les deux mais cette nuance mérite d'être documentée dans le README de la lib.

### 3.2 ✅ Diagnostic de sélecteur introuvable très pauvre — **résolu en 1.1.0 via `--debug`**

Avant : `Waiting for selector \`input[type='email']\` failed`, sans contexte.

Après : `npx portfolio-sync capture --debug` dump à `./debug/<project>-<page>.{png,html,log}` au moment de l'échec (et idem pour les échecs d'auth via `<project>-auth.*`). Aurait économisé ~30 min sur ma session — j'aurais vu immédiatement que la page de signin était un kiosque sans input form.

### 3.3 ⏳ `waitFor` en custom = juste un `setTimeout` — **partiellement résolu en 1.1.0**

`auth.waitForSelector` est désormais accepté pour le type `custom` (avec timeout 15s par défaut). `waitFor` (sleep) reste un fallback. Aligné avec ce que fait `form` auth.

**Limite découverte pendant la migration** : pour une SPA Next.js sans HTML sémantique (pas de `<nav>`, juste des `<div className="...">`), trouver un sélecteur stable post-login est difficile. J'ai fini par déplacer le wait **dans le scriptFile** lui-même via `page.waitForFunction()` :

```cjs
// scripts/auth/intake.cjs (extrait)
await page.waitForFunction(
  () => !location.pathname.startsWith('/auth/signin'),
  { timeout: 15000 }
);
```

→ Suggestion d'évolution : exposer `waitForFunction` (ou `waitForUrl: <regex>`) au niveau config pour éviter d'avoir à mettre la logique dans le script. Voir 4.9 ci-dessous.

---

## 4. Améliorations proposées — état au 22 avril 2026

### Top 3 (gains immédiats)

#### 4.1 ✅ `--debug` / `--on-failure` — **livré en 1.1.0**
Implémenté avec `--debug` + `--debug-dir <path>`. Dump PNG + HTML + log à chaque échec (auth ou page). Voir `dumpDebugArtifacts` dans `src/utils.js`.

#### 4.2 ✅ `expectedUrlPattern` par page — **livré en 1.1.0**
Validation regex au chargement de la config (`src/config.js`) + check après navigation (`src/capturer.js`). Lance `URL mismatch: expected /<pattern>/, got "<url>"` si l'URL finale ne match pas. Exemple :
```json
{ "path": "/manager", "name": "manager", "expectedUrlPattern": "/manager$" }
```

#### 4.3 ✅ `scriptFile` en alternative à `script` — **livré en 1.1.0**
Voir 3.1 ci-dessus. Bonne gestion ESM/CJS via try/catch sur `ERR_REQUIRE_ESM`.

### Nice to have

#### 4.4 ✅ Résolution `${ENV_VAR}` dans `script` custom — **livré en 1.1.0**
Voir 2.2.

#### 4.5 ✅ `waitForSelector` en custom auth — **livré en 1.1.0**
Voir 3.3.

#### 4.6 ❌ `setupScript` par page — **toujours ouvert**

```json
{ "path": "/intake/questions", "name": "questions", "setupScript": "./scripts/setup/intake-state.js" }
```

Permettrait de préparer un état (localStorage, cookie de session intake, séquence de clics) avant la capture. Aurait sauvé `/intake/questions` et `/intake/queue-decision` qui exigeaient un parcours préalable depuis `/intake`.

Note : aujourd'hui on peut mimer ça avec un script d'auth `custom` qui fait tout, mais ça force l'auth à dupliquer la logique pour chaque sous-parcours.

#### 4.7 ❌ Détection "page quasi vide" — **toujours ouvert**

Heuristique simple : warning si **(a)** taille screenshot < N KB **ou** **(b)** > X% pixels uniformes **ou** **(c)** DOM < M éléments visibles.

Aurait attrapé le `/intake/queue-decision` (4.9 KB, juste un spinner) sans avoir à configurer un `expectedUrlPattern` strict (utile aux pages qui chargent leur état mais affichent "No data").

Implémentation possible : passer le `Buffer` PNG par `sharp` avec `stats()` → check `entropy` ou `dominant.r/g/b` couverture.

#### 4.9 ❌ `waitForUrl` au niveau auth — **nouveau, identifié pendant la migration**

Variante de `waitForSelector` qui attend un pattern d'URL au lieu d'un sélecteur DOM :

```json
"auth": {
  "type": "custom",
  "scriptFile": "./scripts/auth/intake.cjs",
  "waitForUrl": "!/^.*/auth/signin/"
}
```

Particulièrement utile pour les SPA modernes sans HTML sémantique fiable post-login. Aurait évité le `waitForFunction` placé dans mon scriptFile (mélange responsabilités auth + navigation).

#### 4.10 ❌ Documentation `scriptFile` + `"type": "module"` — **gotcha non documenté**

Le README de la lib gagnerait à mentionner explicitement :
- Si projet `"type": "module"` → utiliser `.cjs` ou écrire en ESM (`export default`)
- Signature exacte du handler : `(page, context) => Promise<void>` avec `context = { projectUrl, env }`
- Exemple minimal copy-pastable

#### 4.8 ❌ Profils d'auth multiples par projet — **toujours ouvert**

```json
"auth": [
  { "name": "admin", "type": "custom", "scriptFile": "./scripts/auth/intake-admin.js" },
  { "name": "technician", "type": "custom", "scriptFile": "./scripts/auth/intake-tech.js" }
],
"pages": [
  { "path": "/maintenance", "useAuth": "admin" },
  { "path": "/technician/ticket/123", "useAuth": "technician" }
]
```

Permettrait de capturer une page côté admin et une autre côté technicien dans le même run, sans relancer le navigateur. Demande un re-design partiel du flow d'auth (un context par profil + switch entre pages).

---

## 5. Cas concrets ayant motivé ce doc

Trois moments où la lib aurait pu m'éviter du temps perdu :

1. **Page `/intake/queue-decision`** : capture "réussie" → en réalité un spinner. ❌ Toujours non détecté en 1.1.0 — voir 4.7.
2. **Page `/manager` (1er essai)** : capture "réussie" → en réalité la page signin parce que mon `click()` JS n'avait pas déclenché le handler React correctement. ✅ Aurait été flaggé en 1.1.0 via `expectedUrlPattern: "/manager$"`.
3. **Sélecteur `input[type='email']` introuvable** : la page signin était en réalité un kiosque sans formulaire. ✅ Aurait été diagnostiqué en 30 secondes en 1.1.0 via `--debug`.

---

## 6. Migration appliquée

| Avant (1.0.0) | Après (1.1.0) | État |
|---------------|---------------|------|
| Wrapper `scripts/sync-intake.mjs` qui templatait `__INTAKE_PASSWORD__` | Supprimé. Le scriptFile lit `process.env.INTAKE_PASSWORD` via `context.env` | ✅ |
| `auth.script` en JSON inline (longue string échappée) | [`auth.scriptFile: "./scripts/auth/intake.cjs"`](scripts/auth/intake.cjs) — module CJS lintable | ✅ |
| `auth.waitFor: 5000` (sleep aveugle) | `waitFor: 1000` (grâce post-redirect) + `waitForFunction(!/auth/signin)` **dans le scriptFile** (`waitForSelector: "nav"` ne marchait pas, l'app n'a pas de `<nav>`) | ✅ |
| Pas de garde sur les redirects silencieux | `expectedUrlPattern` sur les 7 pages (`/$`, `/intake$`, `/technician$`, `/manager$`, `/maintenance$`, `/maintenance/programmes$`, `/maintenance/export$`) | ✅ |
| `debug/` éventuellement créé par `--debug` | Ajouté au `.gitignore` | ✅ |

**Validation** : `npx portfolio-sync capture --project intake --debug` → 7/7 captures, 4 unchanged (hash MD5 identique à avant migration → vraie idempotence), 0 failed, aucun `expectedUrlPattern` flagué.

**Commande de sync standard**
```bash
npx portfolio-sync capture --project intake          # standard
npx portfolio-sync capture --project intake --debug  # avec dump artifacts en cas d'échec
```

---

## 7. Pour aller plus loin (post-1.1)

- **Mode `interactive`** : ouvrir le navigateur en non-headless, laisser l'humain s'authentifier manuellement, sauvegarder les cookies pour les runs suivants. Utile pour les SSO complexes (Microsoft Entra, Google Workspace).
- **Détection automatique du SSO Microsoft Entra** avec OAuth headless (le bouton "Sign in with INSEAD account" sur ma page de test).
- **`--changed-only`** : ne re-screenshoter que les pages dont le contenu a vraisemblablement changé (HEAD request + comparaison de Last-Modified ou ETag).
- **Plugin Vite/Webpack** : screenshots auto au build sans config externe.
- **Snapshot diff visuel** (à la `pixelmatch`/`reg-suit`) : output du % de pixels changés vs version précédente, génère un rapport HTML.
