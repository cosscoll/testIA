# Studio IA — Retour à la direction validée et pages produits 3D

Date : 3 novembre 2026
Dépôt modifié : `cosscoll/testIA` (`main`), publié sur Vercel.
Dépôts sources inchangés : `Banque-Outils-IA`, `Pack-Proc-dures-Pro`, `IAgile`.

## Décision graphique confirmée

- Restaurer **l'accueil d'origine « Obscure Pop »**, et non conserver la refonte gris charbon / 3 étiquettes de l'itération v2.
- Conserver **exactement les cinq étiquettes interactives superposées** de l'accueil validé, avec animations au survol, au focus clavier et au toucher.
- Rétablir la page Produits et la page Contact dans leur identité graphique Obscure Pop précédente.
- Le travail ultérieur d'affinage UX devra respecter ce visuel validé ; ne pas recréer un design sans nouvelle validation.

Restaurés à partir du commit `1f4004a82cb65d8c4ecf4d18186029971a2fdcf1` :
`index.html`, `catalogue.html`, `contact.html`, `assets/import-shell.css`.

## Parcours détaillé

```text
Accueil / 5 étiquettes interactives
  -> une des 3 collections
  -> l'une des 11 offres
  -> produit.html?id=<identifiant>
       01. Introduction : clé 3D
       02. Le besoin
       03. Résultat visé
       04. Le contenu de l'offre
       05. Le public et les démonstrations
       06. Finale : clé -> serrure -> rotation -> coffre ouvert
  -> lien vers la présentation complète d'origine
```

Les pages originales détaillées restent disponibles à l'intérieur des dossiers `univers/outils/`, `univers/procedures/` et `univers/formations/`.

## Réutilisation réelle de la scène 3D

La page commune `produit.html` charge la **véritable scène** `univers/procedures/assets/apartment-scene.js`, copiée de Pack Procédures Pro sans remplacement par une illustration. Elle utilise :
- Three.js `0.180.0` (MIT), chargé en module via jsDelivr.
- Une clé 3D usinée avec anneau, porte-clés et matières métalliques.
- Sept poses et une courbe de rotation continue avec déplacements lents gauche/droite.
- Un coffre 3D volumétrique dont la serrure tourne et le couvercle s'ouvre en fin de parcours.
- Une solution de repli SVG provenant de la même scène source lorsque WebGL ou les animations ne sont pas disponibles.

Le pilote de défilement `assets/product-cinema.js` conserve les méthodes originales `window.rotationScene.setProgress(0..6)` et `setVaultProgress(0..1)` ; il adapte la progression au défilement des panneaux propres à chacune des 11 offres. Le CSS spécialisé `assets/product-cinema.css` réserve la place à la clé, garde le texte lisible et laisse la scène 3D visible jusqu'au coffre.

Le produit sélectionné change les titres, explications, 4 bénéfices, statut, public et destination du lien final. Aucun paiement ni cours privé ne sont publiés. L'API du chatbot est conservée, **mais son dysfonctionnement signalé n'est pas réparé dans cette intervention**.

## Vérifications

1. L'accueil restauré comprend toujours les **5 cartes `op-card` et l'identifiant `kineticStage`**.
2. Les fichiers JavaScript de chorégraphie et de scène Three.js sont syntaxiquement valides.
3. La page produit charge bien l'animation réelle (non une simple image) avec les éléments DOM requis : `world`, `worldCanvas`, `sceneFallback`, `keyLayer` et `cinemaVault`.
4. Les 11 offres ont chacune 5 panneaux de présentation, un lien final vers la bonne page source et une progression calculée du modèle entre 0 et 6.
5. Le défilement simulé depuis le milieu vers le dernier écran donne respectivement la progression vers le coffre de 0 puis 1.
6. Aucune référence CSS/JS/HTML locale manquante dans la page produit.
7. Le déploiement Vercel doit être confirmé en statut `READY` pour le dernier SHA après ce document.

## Recette à poursuivre

Les tests de logique ne prouvent pas le **rendu réel de la scène Three.js sur les appareils**. Il reste impératif de contrôler en navigateur :
- la clé 3D visible et continue (sans trou ni téléportation) au scroll ;
- les mouvements gauche/droite ; la finale (entrée de la clé dans la serrure, rotation, ouverture du couvercle) ;
- le menu et les textes desktop/mobile, sans chevauchement ;
- la solution de repli quand WebGL / CDN indisponible ;
- les 11 pages produits et le retour aux catégories.

**Ne pas annoncer ces interactions visuelles comme vérifiées tant qu'elles ne l'ont pas été sur un vrai navigateur avec WebGL.**
