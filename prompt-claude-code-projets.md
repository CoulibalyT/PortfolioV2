# Mise à jour de la page Projets — Canvas infini

## Contexte

Je travaille sur mon portfolio développeuse fullstack déployé sur Vercel (`tene-coulibaly.vercel.app`). J'ai besoin de mettre à jour la **page Projets** existante pour remplacer l'affichage actuel par un **canvas 2D infini et pannable** inspiré de godly.website.

Ce n'est **pas une création from scratch** — c'est une **mise à jour** de la page projets déjà existante dans le projet.

---

## Ce que je veux

Un espace 2D infini où mes captures d'écran de projets sont éparpillées comme un moodboard. L'utilisateur se déplace librement dans toutes les directions en glissant (drag souris ou doigt sur mobile). Les images se **répètent à l'infini** — quand on arrive au bout, les mêmes images réapparaissent seamlessly (tiling infini).

### Comportement attendu

- **Pan seulement** — pas de zoom, pas de scroll classique. On se déplace uniquement en glissant.
- **Infini** — les images sont disposées dans une "tuile" de taille fixe (environ 1800×1300px). Cette tuile se répète infiniment dans toutes les directions via un système de modulo. L'utilisateur ne voit jamais de bord ni de vide.
- **Momentum** — quand l'utilisateur relâche, le canvas continue de glisser avec inertie puis ralentit progressivement (friction ~0.93).
- **Clic/tap sur une image** — ouvre une lightbox plein écran avec l'image en grand, le nom de la vue et le nom du projet.
- **Distinction drag vs tap** — si l'utilisateur a bougé de plus de 3px, c'est un drag (pas de lightbox). Sinon c'est un tap (ouvre la lightbox).

### Support tactile (CRITIQUE)

Le touch doit fonctionner parfaitement sur mobile :
- `touch-action: none` sur body et tous les éléments interactifs
- `e.preventDefault()` sur touchstart, touchmove, touchend
- `-webkit-touch-callout: none` et `overscroll-behavior: none` sur body
- Un doigt = pan, tap = lightbox
- Vélocité lissée pour un momentum naturel au doigt

### Design

- **Esthétique dark** inspirée godly.website
  - Background : `#08080a`
  - Cards : `#111113` avec border `rgba(255,255,255, 0.05)`
  - Texte : `#f0ece4`
  - Accent : `#c8ff00` (vert lime)
- **Grille de points** en fond (`radial-gradient`) qui suit le déplacement du canvas
- **Cards** : `border-radius: 14px`, légère rotation aléatoire par carte (entre -2.5° et +2.5°) pour un effet moodboard organique
- **Hover sur les cards** :
  - `box-shadow` avec teinte accent
  - `border-color` accent
  - Image : `scale(1.05)` + brightness/saturation remontées
  - Overlay en bas avec le nom de la vue + nom du projet (slide up)
- **Fonts** : `Instrument Serif` pour les titres, `DM Sans` pour le body (Google Fonts)
- **Header fixe** par-dessus le canvas avec logo + nav (pointer-events: none sur le container, auto sur les liens)
- **Hint** en bas au premier chargement : "Glisser pour explorer" qui disparaît au premier mouvement

---

## Architecture technique

### Principe du tiling infini

Les images sont définies dans un tableau `cards` avec leurs positions (`tx`, `ty`) à l'intérieur d'une tuile de taille `TILE_W × TILE_H`. À chaque frame de rendu :

1. Calculer quelles tuiles sont visibles à l'écran en fonction du pan offset `(px, py)`
2. Pour chaque tuile visible × chaque carte, calculer la position écran : `screenX = card.tx + tileX * TILE_W + px`
3. Frustum cull : ne placer que les cartes visibles à l'écran (avec marge)
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

1. **Identifier** le fichier/composant de la page Projets dans le projet existant
2. **Remplacer** le contenu de cette page par le canvas infini
3. **Conserver** le header/nav existant du site (l'adapter pour qu'il flotte par-dessus le canvas)
4. **Ajouter** les images de mes projets dans le dossier public/assets approprié
5. **Adapter** le tableau `cards` avec mes vraies captures d'écran
6. **S'assurer** que le style est cohérent avec le reste du site (ou adapter le thème si nécessaire)
7. **Tester** le touch sur mobile avant de push

---

## Fichier de référence

J'ai un prototype HTML fonctionnel qui implémente exactement ce comportement. Tu peux t'en inspirer pour l'adapter au framework du projet (React/Next.js/etc.) : le fichier est `portfolio-canvas.html` à la racine.

---

## Points d'attention

- Ne **casse pas** les autres pages du site — c'est uniquement la page Projets qui change
- Le `touch-action: none` et `overflow: hidden` doivent être scopés à cette page uniquement, pas appliqués globalement sur tout le site
- Si le projet utilise React/Next.js, utilise des `useRef` + `useEffect` pour le pan engine plutôt que des event listeners globaux. Clean up les listeners au unmount.
- Les images doivent être en **lazy loading** (`loading="lazy"` ou Intersection Observer)
- Pense à la performance : le render ne doit tourner que pendant le drag et le momentum, pas en boucle infinie
