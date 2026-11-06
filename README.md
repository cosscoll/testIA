# Studio IA — prototype de plateforme unifiée

**Site de test :** https://testia-unifie.vercel.app/  
**Dépôt de travail :** `cosscoll/testIA` — branche `main`  
**Documentation de l’intégration :** [Inventaire complet des trois projets](docs/INTEGRATION_3_PROJETS_2026-11-03.md)

Ce prototype rassemble les contenus publics de trois projets dans une même plateforme, sans modifier leurs dépôts d’origine.

**État au 06/11/2026 :** la plateforme est à nouveau déployée sur Vercel depuis la branche `main`. Un déploiement de production correspondant au commit `174b151` a été vérifié comme **READY** le 6 novembre. Les commits ultérieurs doivent toujours être revérifiés sur Vercel avant d’être annoncés comme visibles. L’ouverture réelle du coffre, les performances et le responsive demandent une recette dans un navigateur.

## Direction graphique actuelle — palette orange/crème validée

La structure validée reprend les **cinq étiquettes interactives superposées** et les animations de l’accueil antérieur. La palette orange/crème, la typographie Poppins et les composants récents proviennent de `assets/charte-control-03.css` (chargé après les styles historiques). Aucune substitution des étiquettes par des cartes plates.

**Nouveau parcours produit :** Accueil → Catalogue → fiche `produit.html?id=...` avec la vraie clé Three.js de Pack Procédures Pro qui suit le scroll et rejoint la serrure du coffre 3D en fin de page → présentation détaillée originale. Le modèle et la chorégraphie source se trouvent dans `univers/procedures/assets/apartment-scene.js`; la mise en scène spécifique est dans `assets/product-cinema.js` et `assets/product-cinema.css`.

Documentation : [retour Obscure Pop et pages produits 3D](docs/RETOUR_OBSCURE_POP_CINEMA_PRODUITS_2026-11-03.md). Les trois dépôts originaux restent inchangés. Le chatbot a été conservé mais son dysfonctionnement signalé reste à corriger.


## Ateliers d'essai gratuits — 6 novembre 2026

Les onze offres disposent chacune d'un **atelier public praticable**, non d'un simple texte de présentation : 49 étapes de travail au total, 55 champs de brief, des critères de contrôle qualité et une génération locale d'un canevas texte réutilisable. La fonction d'export `.txt` ne contacte aucun serveur et n'envoie aucune donnée métier à une IA. Le pack Conciergerie présente les intitulés publics de ses 15 procédures et 7 registres pilotes, sans diffuser les documents commerciaux.

Le parcours est **Catalogue → fiche produit cinématique → atelier associé**, avec accès direct depuis le guide de choix et le module sortant du coffre. La bibliothèque compte 37 ressources publiques : 26 sources importées et 11 ateliers originaux créés pour la plateforme. Les supports commerciaux complets, tarifs, inscriptions et livraisons restent à finaliser.

Contrôles : `node tests/product-depth.cjs`, `node tests/smoke-static.cjs`, `node tests/vault-offer.cjs`. Une recette visuelle sur de vrais appareils est encore nécessaire.

## Les 11 offres représentées

- **Packs Procédures Pro (1)** : pack pilote Conciergeries et locations courte durée.
- **Banques d’outils IA (6)** : Rédaction, Visuels, Sites web, Vidéo & audio, Automatisation, Recherche & analyse.
- **Formations IAgile (4)** : Sites web 3D, Agents personnalisés, Automatiser une tâche, IA au quotidien.

## Navigation du site

L’accueil utilise les cinq étiquettes animées validées. Le catalogue présente les onze offres avec filtres et recherche. Un **guide de choix local en deux étapes** permet de choisir une famille, puis l’un des douze sujets proposés : chaque résultat mène à la fiche produit 3D, et à un exemple gratuit quand il existe. Pour un métier non couvert, il ne recommande aucun faux pack. Ce guide est disponible même lorsque le conseiller IA externe est indisponible ; il n’appelle aucune API et ne collecte aucune donnée. Chaque fiche suit le parcours original de la clé jusqu’au coffre et propose un module commercial sans fausse vente.

- `index.html` : accueil, cinq étiquettes et conseiller IA.
- `assets/offer-finder.js` et `assets/offer-finder.css` : guide de choix instantané du catalogue, sans IA ni coût, douze cas dont un métier non couvert.
- `catalogue.html` : toutes les offres filtrables.
- `produit.html?id=...` : présentation 3D personnalisée pour chaque offre.
- `contact.html` : contact provisoire uniquement pour des retours publics non confidentiels via GitHub Issues.
- `univers/outils/` : banques détaillées, répertoire, fiches et outil gratuit.
- `univers/procedures/` : pack Conciergerie, exemple P01, atelier et animation clé/coffre 3D.
- `univers/formations/` : quatre pages de formation, FAQ, comparateur et ressources gratuites.

## Bibliothèque des ressources publiques

Le regroupement comprend **37 ressources accessibles**, dont **26 ressources d’origine** et **11 ateliers publics complémentaires**, en plus des **11 produits** du catalogue :

- **5 ressources procédures** : exemple P01, atelier de décisions, scène clé/coffre, laboratoire de reproduction et guide technique.
- **13 ressources d'outils IA** : générateur, fiches, guide de choix, cartographie, démonstrations AETHER/FORME/NOVA/WEB PRESS/STUDIO 3D et guides de prompts.
- **8 ressources IAgile** : diagnostics, exercices pratiques, comparateur et FAQ.

**Accès :** https://testia-unifie.vercel.app/ressources.html  
**Inventaire technique :** [26 ressources publiques et provenance](docs/INVENTAIRE_PUBLIC_26_RESSOURCES_2026-11-03.md).

Les fichiers source de grande taille du démonstrateur WEB PRESS restent servis depuis le dépôt Banque Outils IA, à un commit fixe. Les cours privés, les espaces apprenants et les fichiers commerciaux non validés ne sont pas publiés.

## Conseiller IA génératif

Le chatbot issu de Banque Outils IA est intégré à l’accueil, au catalogue et aux pages des trois univers (33 pages HTML). Il est désormais informé sur les 11 offres ; il peut expliquer le bon choix et proposer des liens vers les pages détaillées, après consentement à l’envoi des messages.

Fonction serveurless : `api/chat.js` (Vercel). Modèle exclusif `reflection/beam-free`, avec vérification préalable du tarif à zéro avant chaque génération et sans basculement payant. Si le modèle gratuit n’est pas disponible, le service s’arrête plutôt que d’engager des frais.

**Recette :** intégration, validation et simulations vérifiées ; les réponses réelles depuis le site doivent encore être validées manuellement. Lire [la documentation complète du chatbot](docs/CHATBOT_IA_UNIFIE_2026-11-03.md).

## État commercial

**Ce projet n'est pas une boutique en production.** Aucun paiement, inscription payante, espace client ou livraison automatique de produit n’est actif. Les banques et les formations restent en préparation ; le pack Conciergerie est un pilote. Le contenu privé des cours IAgile n'a pas été publié.

Site statique, sans étape de build, déployé via la connexion GitHub → Vercel. Aucune automatisation récurrente n’a été créée. Vérifications locales sans dépendances : `node tests/smoke-static.cjs`, `node tests/offer-finder.cjs`, `node tests/vault-offer.cjs` et `node tests/chat-contract.cjs`.

Consulter le [rapport d’intégration](docs/INTEGRATION_3_PROJETS_2026-11-03.md) pour le périmètre exact, les vérifications et les étapes restantes.
