# Studio IA — prototype de plateforme unifiée

**Site de test :** https://testia-unifie.vercel.app/  
**Dépôt de travail :** `cosscoll/testIA` — branche `main`  
**Documentation de l’intégration :** [Inventaire complet des trois projets](docs/INTEGRATION_3_PROJETS_2026-11-03.md)

Ce prototype rassemble les contenus publics de trois projets dans une même plateforme, sans modifier leurs dépôts d’origine.

**État du déploiement au 03/11/2026 :** la dernière version **26 ressources** est enregistrée sur GitHub, mais **pas encore publiée sur Vercel**. Le quota gratuit Vercel de 100 déploiements par jour est atteint (erreur 402 – `api-deployments-free-per-day`). Le site public sert encore un commit antérieur ; aucune option payante n’a été activée. Vérifier le SHA déployé et les interactions avant d'annoncer une mise en ligne complète.

## Direction graphique actuelle — Obscure Pop restauré

La refonte visuelle `platform-v2` (trois étiquettes plates) a été **abandonnée** à la demande du propriétaire. L'accueil utilise à nouveau les **cinq étiquettes interactives superposées** du design Banque Outils IA validé, avec `assets/kinetic-hero.css`, `assets/kinetic-hero.js`, `assets/obscure-pop.css` et `assets/unifie.css`.

**Nouveau parcours produit :** Accueil → Catalogue → fiche `produit.html?id=...` avec la vraie clé Three.js de Pack Procédures Pro qui suit le scroll et rejoint la serrure du coffre 3D en fin de page → présentation détaillée originale. Le modèle et la chorégraphie source se trouvent dans `univers/procedures/assets/apartment-scene.js`; la mise en scène spécifique est dans `assets/product-cinema.js` et `assets/product-cinema.css`.

Documentation : [retour Obscure Pop et pages produits 3D](docs/RETOUR_OBSCURE_POP_CINEMA_PRODUITS_2026-11-03.md). Les trois dépôts originaux restent inchangés. Le chatbot a été conservé mais son dysfonctionnement signalé reste à corriger.


## Les 11 offres représentées

- **Packs Procédures Pro (1)** : pack pilote Conciergeries et locations courte durée.
- **Banques d’outils IA (6)** : Rédaction, Visuels, Sites web, Vidéo & audio, Automatisation, Recherche & analyse.
- **Formations IAgile (4)** : Sites web 3D, Agents personnalisés, Automatiser une tâche, IA au quotidien.

## Navigation du site

L’accueil utilise cinq étiquettes animées inspirées du site Banque Outils IA validé. Le catalogue présente les onze offres avec des filtres par famille. Chaque carte produit mène à une présentation cinématique avec la clé 3D qui suit le défilement et ouvre le coffre, puis à sa page détaillée. Les démonstrations gratuites sont accessibles depuis l’accueil.

- `index.html` : accueil et guide de choix.
- `catalogue.html` : toutes les offres filtrables.
- `produit.html?id=...` : présentation 3D personnalisée pour chaque offre.
- `contact.html` : contact provisoire uniquement pour des retours publics non confidentiels via GitHub Issues.
- `univers/outils/` : banques détaillées, répertoire, fiches et outil gratuit.
- `univers/procedures/` : pack Conciergerie, exemple P01, atelier et animation clé/coffre 3D.
- `univers/formations/` : quatre pages de formation, FAQ, comparateur et ressources gratuites.

## Bibliothèque des ressources publiques

Le regroupement comprend désormais **26 ressources accessibles** dans une bibliothèque progressive, en plus des **11 produits** du catalogue :

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

Site statique, sans étape de build, déployé via la connexion GitHub → Vercel. Aucune automatisation récurrente n’a été créée.

Consulter le [rapport d’intégration](docs/INTEGRATION_3_PROJETS_2026-11-03.md) pour le périmètre exact, les vérifications et les étapes restantes.
