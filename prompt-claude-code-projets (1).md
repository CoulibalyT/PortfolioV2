# Mise à jour de la page Projets — Canvas infini pleine page

## Contexte

Je travaille sur mon portfolio développeuse fullstack sur Vite (`localhost:5173`), déployé sur Vercel (`tene-coulibaly.vercel.app`). J'ai besoin de mettre à jour la **page `/projects`** pour remplacer l'affichage actuel par un **canvas 2D infini et pannable** qui prend **toute la page** (100vw × 100vh).

Ce n'est **pas une création from scratch** — c'est une **mise à jour** de la page projets déjà existante dans le projet.

---

## IMPORTANT — Layout pleine page

La page projets doit être **radicalement différente** des autres pages du site :

- Le canvas prend **100vw × 100vh** — pas de scroll classique, pas de contenu en dessous
- **Masquer la sidebar de navigation** (Moi, Projets, Compétences, Parcours, Contact, Le Labo) sur cette page uniquement
- **Masquer le footer** (la barre avec "Paris, FR", la température, etc.) sur cette page uniquement
- **Masquer le header principal** ("Tene Coulibaly /te.ne/ Développeur & Designer") sur cette page uniquement
- À la place, afficher un **mini header flottant** en `position: fixed` par-dessus le canvas :
  - Logo/nom à gauche (lien retour vers l'accueil)
  - Un lien "← Retour" ou juste le nom cliquable
  - Fond : `transparent` ou léger `backdrop-filter: blur(20px)` avec fond semi-transparent
  - `pointer-events: none` sur le container, `pointer-events: auto` sur les liens cliquables
  - `z-index` au-dessus du canvas
- Le `body` ou le container de cette page doit avoir `overflow: hidden` — mais **scopé à cette page seulement**, ne pas casser le scroll des autres pages

---

## Ce que je veux

Un espace 2D infini où mes captures d'écran de projets sont éparpillées comme un moodboard. L'utilisateur se déplace librement dans toutes les directions en glissant (drag souris ou doigt sur mobile). Les images se **répètent à l'infini** — quand on arrive au bout, les mêmes images réapparaissent seamlessly (tiling infini).

### Comportement attendu

- **Pan seulement** — pas de zoom, pas de scroll classique. On se déplace uniquement en glissant
- **Infini** — les images sont disposées dans une "tuile" de taille fixe (~1800×1300px). Cette tuile se répète infiniment dans toutes les directions via un système de modulo. L'utilisateur ne voit jamais de bord ni de vide
- **Momentum** — quand l'utilisateur relâche, le canvas continue de glisser avec inertie puis ralentit progressivement (friction ~0.93)
- **Clic/tap sur une image** — ouvre une lightbox plein écran avec l'image en grand, le nom de la vue et le nom du projet
- **Distinction drag vs tap** — si l'utilisateur a bougé de plus de 3px, c'est un drag (pas de lightbox). Sinon c'est un tap (ouvre la lightbox)

### Support tactile (CRITIQUE)

Le touch doit fonctionner parfaitement sur mobile :
- `touch-action: none` sur le container du canvas et tous les éléments interactifs
- `e.preventDefault()` sur touchstart, touchmove, touchend
- `-webkit-touch-callout: none` et `overscroll-behavior: none` sur le container
- Un doigt = pan, tap = lightbox
- Vélocité lissée pour un momentum naturel au doigt

### Design

- **Background du canvas** : `#08080a` (noir profond) — toute la page est sombre
- **Cards** : `#111113` avec border `rgba(255,255,255, 0.05)`, `border-radius: 14px`
- **Texte** : `#f0ece4`
- **Accent** : `#c8ff00` (vert lime) — pour le hover des cards et le logo
- **Grille de points** en fond (`radial-gradient`) qui suit le déplacement du canvas
- **Rotation aléatoire** par carte (entre -2.5° et +2.5°) pour un effet moodboard organique
- **Hover sur les cards** :
  - `box-shadow` avec teinte accent
  - `border-color` accent
  - Image : `scale(1.05)` + brightness/saturation remontées
  - Overlay gradient en bas avec le nom de la vue + nom du projet (slide up)
- **Fonts** : Garder les fonts du site existant, ou utiliser `Instrument Serif` (titres) + `DM Sans` (body) si elles ne sont pas déjà installées
- **Hint** en bas au premier chargement : "Glisser pour explorer" qui disparaît au premier mouvement
- **Lightbox** : fond noir 93% opacité + backdrop-filter blur, image max 90vw/84vh, se ferme au clic/tap ou Escape

---

## Architecture technique

### Principe du tiling infini

Les images sont définies dans un tableau `cards` avec leurs positions (`tx`, `ty`) à l'intérieur d'une tuile de taille `TILE_W × TILE_H`. À chaque frame de rendu :

1. Calculer quelles tuiles sont visibles à l'écran en fonction du pan offset `(px, py)`
2. Pour chaque tuile visible × chaque carte, calculer la position écran : `screenX = card.tx + tileX * TILE_W + px`
3. Frustum cull : ne placer que les cartes visibles à l'écran (avec marge de ~80px)
4. Recycler un pool de DOM elements (object pooling) pour la performance

```
Tuiles visibles :
startTileX = floor(-px / TILE_W) - 1
endTileX   = floor((-px + viewportWidth) / TILE_W) + 1
(idem en Y)
```

### Pool de cartes DOM

Pré-créer `cards.length × 9` éléments DOM (assez pour couvrir 3×3 tuiles). À chaque render, réaffecter les éléments visibles et masquer les autres (`display: none`).

### Structure de données des cartes

```javascript
const cards = [
  {
    w: 480,          // largeur en px
    h: 340,          // hauteur en px  
    tx: 60,          // position X dans la tuile
    ty: 50,          // position Y dans la tuile
    rot: -1.2,       // rotation en degrés
    img: '/images/projects/dashboard-overview.png',
    label: "Vue d'ensemble",
    project: 'Dashboard Analytics'
  },
  // ... autres cartes
];

const TILE_W = 1800;
const TILE_H = 1300;
```

---

## Ce qu'il faut faire concrètement

1. **Identifier** le fichier/composant de la page `/projects` dans le projet
2. **Remplacer** le contenu de cette page par le canvas infini pleine page
3. **Conditionner** la sidebar, le header principal et le footer pour qu'ils ne s'affichent **pas** sur la route `/projects` (vérifier dans le layout parent ou le composant App)
4. **Ajouter** un mini header flottant propre à cette page (logo + retour accueil)
5. **Ajouter** le système de pan infini (tiling + pool DOM + momentum + touch)
6. **Ajouter** la lightbox
7. **Adapter** le tableau `cards` avec mes vraies captures d'écran de projets
8. **Scoper** les styles (`overflow: hidden`, `touch-action: none`, fond sombre) à cette page uniquement — ne pas affecter les autres pages
9. **Tester** le touch sur mobile et le drag sur desktop

---

## Fichier de référence

J'ai un prototype HTML fonctionnel qui implémente exactement le comportement du canvas infini. Il est à la racine du projet : `portfolio-canvas.html`. Inspire-toi en pour l'adapter au framework du projet (React/Vue/etc.), mais ne le copie pas tel quel — adapte-le proprement avec des composants, des hooks, et un cleanup au unmount.

---

## Points d'attention

- Ne **casse pas** les autres pages du site — seule la page `/projects` change
- Le `overflow: hidden` et `touch-action: none` doivent être **scopés** à cette page. Utilise un `useEffect` qui ajoute une classe au body au mount et la retire au unmount, ou scope via le container du composant
- Si le projet utilise React, utilise `useRef` + `useEffect` pour le pan engine. **Clean up tous les event listeners au unmount**
- Les images doivent être en **lazy loading**
- Le render loop ne doit tourner que **pendant le drag et le momentum**, pas en boucle infinie permanente
- Le curseur doit être `grab` par défaut et `grabbing` pendant le drag
- La page doit fonctionner même avec peu de projets (2-3) — le tiling répète tout à l'infini donc ça remplira l'espace
