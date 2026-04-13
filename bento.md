# Bento - Documentation Complete du Projet (Web + API + Plugin Figma)

Ce document est un dossier technique complet pour expliquer le projet Bento a une IA (ou a un nouveau developpeur) sans contexte prealable.

Objectif: decrire clairement ce que fait chaque partie, comment tout s'articule, comment lancer le systeme, et quels sont les points sensibles (securite, anti-plagiat, detection IA, deploiement).

---

## 1) Vue d'ensemble

Le workspace contient principalement 2 applications:

1. `bento/` : la plateforme principale (frontend Vue + backend Express/Prisma).
2. `bento-figma-plugin/` : plugin Figma officiel pour soumettre des designs directement dans Bento.

Et un document de specification IA:

1. `bento-ai-detection-spec.md` : spec d'amelioration du pipeline anti-IA.

Le projet global est une plateforme de challenges creatifs:

1. les utilisateurs creent/participent a des challenges;
2. soumettent des projets (avec image, tags, WIP, fichiers sources);
3. votent;
4. consultent classements/resultats;
5. les admins moderent (utilisateurs, signalements, settings, logs, etc.).

---

## 2) Architecture Globale

### 2.1 Sous-projet principal: `bento/`

`bento/` est lui-meme decoupe en:

1. `bento/client/` : application frontend Vue 3 (Vite).
2. `bento/server/` : API backend Node.js/Express + Prisma/PostgreSQL.

### 2.2 Sous-projet plugin: `bento-figma-plugin/`

Plugin Figma qui:

1. autentifie l'utilisateur via token Bento;
2. lit la selection de frames Figma;
3. exporte les frames en PNG;
4. appelle l'API Bento pour uploader l'image, creer un projet, puis uploader les WIP.

---

## 3) Stack Technique

### 3.1 Backend (`bento/server`)

1. Node.js + Express.
2. Prisma ORM + PostgreSQL.
3. JWT auth + refresh tokens.
4. Cloudinary (images + fichiers source prives).
5. SendGrid (emails).
6. Socket.io (realtime/notifs).
7. Zod + validateurs + middlewares.
8. Securite: Helmet, CORS strict, rate limiting.
9. Detection IA: analyse locale metadata + FFT + Hugging Face + providers externes optionnels (SightEngine/Hive).

### 3.2 Frontend (`bento/client`)

1. Vue 3 + Vite.
2. Vue Router (beaucoup de routes lazy loaded).
3. Pinia (state management).
4. TanStack Vue Query.
5. Tailwind CSS.
6. i18n + SEO head management + web-vitals + GA4.

### 3.3 Plugin Figma (`bento-figma-plugin`)

1. Runtime Figma Plugin API.
2. UI plugin en HTML + Vue global (CDN) + Tailwind CDN.
3. TypeScript compile vers `code.js`.

---

## 4) Fonctionnel Produit

### 4.1 Fonctionnalites principales

1. Auth locale + Google OAuth.
2. Gestion profil utilisateur (infos, avatar, settings, notifications).
3. Creation/edition/suppression de challenges.
4. Participation aux challenges.
5. Soumission de projets (draft/submitted/etc.) avec image principale.
6. WIP (Work In Progress) multiples pour prouver la demarche creatrice.
7. Upload de fichiers sources (PSD/AI/FIG/SKETCH...) en stockage prive.
8. Votes + anti-cheat (ip hash, device id, verification de patterns).
9. Classements/resultats/hall of fame.
10. Favoris, commentaires, tags, metadata, badges, referral.
11. Interface admin (dashboards + moderation + feedback + logs + settings).

### 4.2 Anti-plagiat

Le systeme anti-plagiat est deja fortement implemente:

1. tables dediees (`ProjectWIP`, `SourceFile`, `PlagiarismReport`);
2. endpoints de signalement et moderation;
3. verification status projet (`PENDING`, `VERIFIED`, `SUSPICIOUS`, `INVALIDATED`);
4. donnees d'authenticite consultables cote moderation.

Documents associes dans `bento/`:

1. `ANTI_PLAGIARISM_ARCHITECTURE.md`
2. `ANTI_PLAGIARISM_IMPLEMENTATION.md`
3. `ANTI_PLAGIARISM_TESTING.md`
4. `ANTI_PLAGIARISM_SUMMARY.md`

---

## 5) Structure des Dossiers (essentiel)

### 5.1 Backend (`bento/server`)

1. `index.js` : point d'entree Express, middlewares, routes, Socket.io, cron jobs.
2. `routes/` : definitions API par domaine (`authRoutes.js`, `challengeRoutes.js`, `projectRoutes.js`, etc.).
3. `controllers/` : couche HTTP.
4. `services/` : logique metier (auth, challenge, project, vote, IA detection...).
5. `repositories/` : acces base de donnees (pattern repository).
6. `middlewares/` : auth, validations, role checks, erreurs globales...
7. `validators/` : schemas Zod et validation des payloads.
8. `config/` : prisma, cloudinary, upload, logger, passport...
9. `prisma/schema.prisma` : modele de donnees complet.
10. `tests/` : tests Jest/Supertest.

### 5.2 Frontend (`bento/client/src`)

1. `main.js` : bootstrap app, plugins (Pinia, Router, Query, Toast, i18n, GA4, head manager).
2. `App.vue` : layout global, sidebar, mobile nav, transitions.
3. `router/index.js` : routes publiques/privees/admin + guards auth/roles/maintenance.
4. `views/` : pages ecran.
5. `components/` : composants UI et metier.
6. `stores/` : etat global Pinia.
7. `api.js` + `fetchers.js` : appels API/intercepteurs.
8. `config/`, `composables/`, `utils/` : infrastructure frontend.

### 5.3 Plugin Figma (`bento-figma-plugin`)

1. `manifest.json` : metadata plugin + domaines reseau autorises.
2. `code.ts` : logique plugin cote Figma (selection, export, storage token).
3. `ui.html` : interface utilisateur plugin + appels API Bento.
4. `code.js` : sortie compilee TypeScript.

---

## 6) Flux Metier Important (de bout en bout)

### 6.1 Soumission projet depuis Web

1. User ouvre formulaire de soumission.
2. Upload image -> backend upload pipeline.
3. Extraction metadata + detection IA + compression.
4. Upload Cloudinary.
5. Creation projet en base.
6. Eventuels WIP et fichiers sources ajoutes ensuite.

### 6.2 Soumission projet depuis Plugin Figma

1. User colle token API Bento dans le plugin.
2. Plugin verifie token via endpoint profil.
3. Plugin recupere challenges ouverts.
4. User selectionne plusieurs frames Figma.
5. Plugin exporte la frame principale en PNG -> POST `/api/upload/image`.
6. Plugin cree projet via POST `/api/project/create/:challengeId`.
7. Les autres frames sont envoyees en WIP via POST `/api/project/:projectId/wip`.
8. UI plugin affiche progression et succes/echec.

### 6.3 Moderation anti-plagiat

1. Utilisateur signale un projet (`/report-plagiarism`).
2. Signalement stocke en `PlagiarismReport`.
3. Le projet peut etre marque `SUSPICIOUS`.
4. Admin examine authenticite (WIP, metadata, reports, etc.).
5. Admin met a jour `verification_status`.

---

## 7) API: Domaines Principaux

Routes montees dans `bento/server/index.js`:

1. `/api/user` : auth + profil + tokens + oauth.
2. `/api/challenges` : CRUD challenges, participations, criteres, contraintes.
3. `/api/project` : projets, tags, favorites, WIP, sources, signalements, verification.
4. `/api/upload` : upload image autonome.
5. `/api/votes`, `/api/results`, `/api/rankings`.
6. `/api/notifications`, `/api/settings`, `/api/metadata`, `/api/tags`, `/api/badges`.
7. `/api/admin` : operations admin.
8. `/api/webhooks`, sitemap routes.

---

## 8) Securite (etat actuel)

Mecanismes actifs:

1. Helmet (headers HTTP).
2. CORS controle par liste blanche (`FRONTEND_URL` en prod).
3. Rate limiting global + auth limiter.
4. JWT secret obligatoire.
5. Middleware centralise pour erreurs et auth.

Reference: `bento/server/SECURITY.md`.

---

## 9) Detection IA (images)

### 9.1 Pourquoi cette feature est critique

La detection anti-IA est l'une des features les plus importantes de Bento car elle protege la credibilite des challenges.

Sans ce systeme:

1. des contenus generes automatiquement peuvent noyer les creations humaines;
2. la confiance des createurs chute;
3. la moderation devient reactive et trop tardive.

Avec ce systeme, Bento cherche a trouver un equilibre:

1. proteger la plateforme contre les uploads IA evidents;
2. eviter de bloquer des vrais designers (faux positifs);
3. conserver des preuves techniques exploitables par les admins.

### 9.2 Ou vit le systeme dans le code

Pieces principales:

1. `bento/server/config/upload.js` : orchestration du pipeline avant upload Cloudinary.
2. `bento/server/services/imageAnalysisService.js` : couche metadata/EXIF (locale).
3. `bento/server/services/fftAnalysisService.js` : couche FFT checkerboard (locale).
4. `bento/server/services/aiDetectionService.js` : couche visuelle/API + normalisation des scores.

### 9.3 Pipeline anti-IA (ordre d'execution)

Lors d'un upload image (ex: cover projet), le backend suit cet ordre:

1. validation fichier (type/taille/magic bytes via middlewares/config upload);
2. extraction metadata image (sharp + EXIF);
3. Layer 1 - analyse metadata locale (`imageAnalysisService`);
4. Layer 1.5 - analyse FFT locale (`fftAnalysisService`);
5. Layer 2 - analyse visuelle (`aiDetectionService.detectBuffer`, Hugging Face si token disponible);
6. prise de decision (bloquer / flagger / laisser passer);
7. seulement ensuite: compression + upload Cloudinary + suite du flux metier.

Point cle: la detection est faite le plus tot possible dans le pipeline pour limiter le stockage de contenus suspects.

### 9.4 Description des couches

#### Layer 1: Metadata / EXIF (local, gratuit, rapide)

Objectif: lire des signaux techniques dans le fichier.

Exemples de signaux:

1. logiciel source (`Software`) correspondant a des generateurs IA ou a des outils creatifs;
2. presence/absence d'EXIF pertinents;
3. profil ICC, DPI, dimensions typiques;
4. patterns dans le nom de fichier.

Sortie typique:

1. `detectedSource` (`ai_generator`, `creative_software`, `camera`, `unknown`);
2. `confidence` (0-100);
3. `flags` explicatifs.

#### Layer 1.5: FFT Checkerboard (local, gratuit)

Objectif: detecter des artefacts frequenciels (checkerboard) souvent associes aux images de diffusion.

Approche:

1. image redimensionnee (256x256), grayscale;
2. FFT 2D;
3. analyse de l'energie hautes frequences;
4. production d'un score et d'un indicateur `hasCheckerboard`.

Sortie typique:

1. `hasCheckerboard` (bool);
2. `score` (0-100);
3. details (`energyRatio`, etc.).

#### Layer 2: Detection visuelle (API)

Objectif: classifier visuellement l'image (au-dela des metadata).

Etat actuel:

1. Hugging Face via buffer brut si `HUGGINGFACE_API_TOKEN` est configure;
2. le service gere les erreurs sans casser le flux (fallback non bloquant).

Providers supportes par le service:

1. Hugging Face (buffer direct);
2. SightEngine (freemium, selon config);
3. Hive (payant, optionnel).

### 9.5 Logique de decision (regles metier)

La decision combine plusieurs signaux. Version actuelle (dans `upload.js`):

1. si confiance tres elevee IA (ex: score visuel > 80 ou autre combinaison forte) -> blocage;
2. si suspicion moyenne (score intermediaire, checkerboard, metadata douteux) -> upload possible mais image marquee suspecte;
3. si score faible -> flux normal.

Regle pratique explicite dans le code:

1. seuil de blocage haut (>= 80) pour limiter les faux positifs;
2. zone grise conservee pour moderation humaine.

### 9.6 Ce qui est stocke pour la moderation

Le systeme conserve un rapport exploitable:

1. details des couches (metadata, FFT, visuel);
2. confidence agregee;
3. drapeaux de suspicion;
4. lien avec les mecanismes anti-plagiat (WIP, reports, verification status).

Resultat: l'admin ne voit pas seulement "IA ou pas IA", il voit "pourquoi" le systeme a decide.

### 9.7 Pourquoi ce design est robuste

Bento n'utilise pas une seule source de verite. Le systeme est multi-couches:

1. local + instantane (metadata/FFT);
2. visuel + probabiliste (classification API);
3. moderation humaine via preuves d'authenticite (WIP/sources/reports).

Ce mix reduit les risques suivants:

1. contourner un detecteur unique;
2. faux positifs massifs;
3. indisponibilite d'un provider externe.

### 9.8 Fallback et tolerance aux pannes

Le pipeline est concu pour degrader proprement:

1. si un provider externe echoue (timeout, 503, quota), le local continue;
2. en cas d'incertitude, Bento prefere souvent flagger plutot que bloquer;
3. les erreurs API sont tracees sans stopper tout le systeme (sauf cas de blocage volontaire a haute confiance).

### 9.9 Variables d'environnement anti-IA

Variables a connaitre:

1. `AI_DETECTION_ENABLED` : active/desactive le systeme externe;
2. `HUGGINGFACE_API_TOKEN` : active la couche visuelle Hugging Face;
3. `SIGHTENGINE_API_USER` et `SIGHTENGINE_API_SECRET` : provider freemium;
4. `HIVE_API_KEY` : provider payant optionnel.

### 9.10 Lien avec la roadmap

La vision strategique complete est documentee dans `bento-ai-detection-spec.md`.

Ce document de spec decrit notamment:

1. la logique de seuils cible;
2. l'ordre ideal des couches;
3. la contrainte "detection la plus tot possible";
4. les evolutions de precision et performance.

---

## 10) Modele de Donnees (Prisma)

Fichier: `bento/server/prisma/schema.prisma`.

Entites coeur:

1. `User`, `Challenge`, `Project`, `Image`, `Vote`, `VoteResult`.
2. `ProjectWIP`, `SourceFile`, `PlagiarismReport` (anti-plagiat).
3. `Notification`, `UserSettings`, `Follow`, `Badge`, `UserBadge`, `Referral`.

Enums critiques:

1. `ProjectStatus` (`DRAFT`, `SUBMITTED`, `APPROVED`, ...).
2. `ChallengeStatus` (`OPEN`, `VOTING`, `CLOSED`).
3. `VerificationStatus` (`PENDING`, `VERIFIED`, `SUSPICIOUS`, `INVALIDATED`).
4. `Role` (`USER`, `ADMIN`, `CREATOR`, `MODERATOR`).

---

## 11) Variables d'Environnement

### 11.1 Backend (`bento/server/.env.example`)

Variables majeures:

1. DB: `DATABASE_URL`.
2. Auth: `JWT_SECRET`.
3. Infra: `PORT`, `NODE_ENV`, `FRONTEND_URL`.
4. Cloudinary: `CLOUD_NAME`, `API_KEY`, `API_SECRET`.
5. Email: `SENDGRID_API_KEY`, `FROM_EMAIL`, `FROM_NAME`, `APP_URL`.
6. Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.
7. IA detection: `SIGHTENGINE_API_USER`, `SIGHTENGINE_API_SECRET`, `HIVE_API_KEY`, `HUGGINGFACE_API_TOKEN`, `AI_DETECTION_ENABLED`.

### 11.2 Frontend (`bento/client/.env.example`)

Variables majeures:

1. `VITE_API_URL`.
2. `VITE_CLOUDINARY_CLOUD_NAME`.
3. `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. `VITE_GA4_MEASUREMENT_ID`.

---

## 12) Comment Lancer le Projet en Local

Depuis la racine workspace (ce dossier):

### 12.1 Backend

1. `cd bento/server`
2. `npm install`
3. `cp .env.example .env` puis completer les variables
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run dev`

API par defaut: `http://localhost:5001`.

### 12.2 Frontend

1. `cd bento/client`
2. `npm install`
3. `cp .env.example .env` puis completer
4. `npm run dev`

Frontend par defaut: `http://localhost:5173`.

### 12.3 Plugin Figma

1. `cd bento-figma-plugin`
2. `npm install`
3. `npm run build` (ou `npm run watch`)
4. dans Figma: import plugin en mode dev via le `manifest.json`

Important:

1. l'UI du plugin pointe actuellement sur `http://localhost:5001/api` (hardcode dans `ui.html`);
2. le lien "Ou trouver mon token" pointe sur `http://localhost:5173/settings/api`.

---

## 13) Scripts Importants

### 13.1 Backend (`bento/server/package.json`)

1. `npm run dev` : lancement dev.
2. `npm run prod` : lancement avec `.env.production`.
3. `npm run test` : tests Jest.
4. `npm run seed` : seed.
5. `npm run seed:fresh` : reset DB + seed.
6. `npm run prisma:deploy` : migration deploy (prod).

### 13.2 Frontend (`bento/client/package.json`)

1. `npm run dev` : dev server.
2. `npm run build` : build prod.
3. `npm run serve` : preview.
4. `npm run analyze` : build analyse bundle.
5. `npm run lint` : lint + fix.

### 13.3 Plugin (`bento-figma-plugin/package.json`)

1. `npm run build` : compile TS.
2. `npm run watch` : watch mode.

---

## 14) Deploiement

### 14.1 Backend

1. `bento/heroku.yml` present (build Docker depuis `server/Dockerfile`).
2. release command: `npm run prisma:deploy`.
3. script de deploiement infra: `bento/scripts/deploy.sh` (PM2 + backup + migrate + healthcheck).

### 14.2 Frontend

1. `bento/client/vercel.json` configure rewrite SPA.

---

## 15) Points d'Attention / Dette Technique

1. Plusieurs fichiers legacy/backups existent (`*.old.js`, `*.backup.js`) dans services/controllers.
2. Le plugin Figma utilise des URLs locales hardcodees dans `ui.html` (a parametrer pour prod).
3. La doc est riche mais dispersee; ce fichier sert de point d'entree unique.
4. Certains comportements de securite/de detection IA doivent etre verifies regulierement via tests de non-regression.

---

## 16) Fichiers a Lire en Priorite (ordre conseille pour une IA)

1. `README_PROJET_COMPLET_POUR_IA.md` (ce document).
2. `bento/server/index.js` (wiring global backend).
3. `bento/server/prisma/schema.prisma` (modele metier).
4. `bento/server/routes/projectRoutes.js` + `challengeRoutes.js` + `authRoutes.js`.
5. `bento/server/config/upload.js` (pipeline upload, anti-IA).
6. `bento/server/services/aiDetectionService.js`, `imageAnalysisService.js`, `fftAnalysisService.js`.
7. `bento/client/src/main.js`, `App.vue`, `router/index.js`.
8. `bento-figma-plugin/code.ts` + `ui.html` + `manifest.json`.
9. `bento/ANTI_PLAGIARISM_*.md` + `bento/server/SECURITY.md`.

---

## 17) Resume express pour une IA

Bento est une plateforme de challenges design avec:

1. un frontend Vue riche (user + admin + SEO + performance),
2. un backend Express/Prisma structure en couches (routes/controllers/services/repositories),
3. un pipeline anti-plagiat (WIP/sources/reports/verification),
4. un pipeline de detection d'images IA multi-couches,
5. un plugin Figma qui pousse directement des designs vers l'API Bento.

Si tu dois modifier le produit, commence par le schema Prisma + routes + services, puis aligne frontend/plugin sur les contrats API.