# testIA — prototype de plateforme unifiée

Prototype séparé réunissant **Packs Procédures Pro**, **Banques d'outils IA** et **Formations IAgile**.

## Direction
- Base visuelle : accueil interactif « Obscure Pop » du dépôt `cosscoll/Banque-Outils-IA`.
- Cinq étiquettes interactives conservées, réorientées vers les trois familles de produits.
- Un seul catalogue avec filtres et recherche, des fiches détaillées, un parcours simple.
- Aucune transaction ni achat actif : il s'agit d'un prototype de validation de l'architecture et de la direction graphique.
- Aucune modification des trois dépôts sources.

## Pages
- `index.html` — page d'accueil, découverte des 3 catégories et mini-guide.
- `catalogue.html` — 11 offres (1 pack procédures, 6 banques et 4 formations) avec filtres.
- `produit.html?id=...` — détails des offres, accessibles depuis les étiquettes et le catalogue.

## Source de l'interaction
Les fichiers `assets/kinetic-hero.css`, `assets/kinetic-hero.js` et `assets/obscure-pop.css` viennent de Banque-Outils-IA (projet original de l'utilisateur). Le prototype adapte ces composants sans modifier l'original.

## Publication
Site statique sans build et sans dépendance serveur. Déploiement Vercel depuis GitHub possible.
