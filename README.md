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

Les onze offres disposent chacune d'un **atelier public praticable**, non d'un simple texte de présentation : 49 étapes de travail au total, 55 champs de brief, des critères de contrôle qualité, des exemples fictifs préremplis et une génération locale d'un canevas texte réutilisable. La fonction d'export `.txt` ne contacte aucun serveur et n'envoie aucune donnée métier à une IA. Le pack Conciergerie présente les intitulés publics de ses 15 procédures et 7 registres pilotes, sans diffuser les documents commerciaux.

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


## Sécurité et contrôle de la publication (session 01, 06/11/2026)

- En-têtes de sécurité versionnés dans `vercel.json` ; exclusion des fichiers de travail non destinés au site via `.vercelignore`.
- Vérification manuelle sans API : `node scripts/verify-release.cjs` (six scripts, dont `tests/security-static.cjs`).
- Voir `docs/SESSION_01_SECURITE_2026-11-06.md` pour la recette, les limites et les réglages GitHub à effectuer par le propriétaire.
- Le dépôt reste public et la protection de `main` nécessite une configuration dans GitHub. Aucun workflow récurrent, aucune CI payante, aucun accès aux produits premium n'a été activé.

## Session 02 — Pack Conciergerie, édition pilote v0.2 (06/11/2026)

Un dossier de travail privé a été préparé hors dépôt : quinze procédures approfondies en Markdown, manuel DOCX éditable et PDF de 18 pages, sept CSV vierges et sept CSV fictifs, dictionnaire de données, exemple transversal et validateur Python local. Dix cas invalides ont été détectés lors de la recette ; la validation professionnelle métier et juridique reste à réaliser. **Aucune vente active.**

La page publique du pack ne présente que le statut de ce travail et un lien vers un atelier gratuit. Les fichiers commerciaux DOCX/PDF/CSV ne sont ni committés dans GitHub ni publiés sur Vercel.

Suivi : https://github.com/cosscoll/testIA/issues/2

## Sessions de travail : chaque lot doit être visible en production

Le travail est désormais découpé en lots fonctionnels publiés sur la version test. Une session ne peut être annoncée terminée sans **changement vérifiable sur le site**, commit GitHub identifiable et Vercel synchronisé en état READY. Voir [les lots LIV-01 à LIV-11](docs/SESSIONS_LIVRAISONS_VISIBLES_2026-11-06.md) et [la feuille de route GitHub](https://github.com/cosscoll/testIA/issues/9).

**LIV-01** : les onze cartes du catalogue proposent maintenant un bouton d'accès direct à l'atelier gratuit du produit, distinct de la fiche cinéma clé/coffre ; conservation des filtres et de la recherche. Test manuel dédié : `node tests/catalogue-actions.cjs`. Les ateliers restent des exemples publics et aucun achat n'est ouvert.

## LIV-02 — Atelier Rédaction & communication (06/11/2026)

La [démonstration de rédaction](univers/outils/outils/assistant-messages.html) propose quatre formats (e-mail, relance, publication, texte web), trois exemples métier, trois tons, un fait concret, cinq repères de relecture, un texte éditable, copie, export .txt et un prompt à coller dans l'outil IA de son choix. L'atelier est déterministe et local **sans IA connectée ni paiement**, les produits premium restent en préparation. Vérification manuelle : `node tests/message-studio.cjs` et `node scripts/verify-release.cjs`.

L'atelier conserve le conseiller IA unifié et ses données catalogue. Les champs du brief local ne sont jamais transmis automatiquement au conseiller.

Suivi LIV-02 : une amélioration visible est à la fois intégrée à la page produit et aux ressources ; consulter [le bilan de livraison](docs/SESSIONS_LIVRAISONS_VISIBLES_2026-11-06.md#bilan-liv-02--6-novembre-2026).

## LIV-03 — Construire et tester un workflow (06/11/2026)

La [démonstration interactive d’automatisation](univers/outils/outils/atelier-automatisation.html) permet de concevoir des étapes de travail, de tester des cas d'erreur, de simuler une approbation humaine et d'exporter des plans JSON/TXT **sans installer ni activer aucune automatisation**. Le JSON est intentionnellement marqué `enabled:false` et `mode:simulation-only`. La vitrine du produit et le catalogue de ressources pointent désormais vers cette démonstration. Test manuel : `node tests/workflow-studio.cjs`.

## LIV-04A — Banque Création visuelle (06/11/2026)

La [démonstration graphique publique](univers/outils/outils/atelier-visuels.html) crée directement des affiches carrées ou portrait depuis un brief. Trois exemples, trois palettes et trois compositions ; prévisualisation SVG, contrôles de contraste, export SVG, PNG et texte. Aucune API, aucune image externe ni paiement. Le produit complet reste en préparation ; poursuivre ensuite LIV-04B/C/D sur les autres banques. Test manuel : `node tests/visual-studio.cjs`.

## LIV-04B — Constructeur de sites web gratuit (06/11/2026)

Le [nouvel atelier Sites web & prototypes](univers/outils/outils/atelier-sites-web.html) assemble une page HTML responsive depuis un brief, 3 cas métier, 3 compositions, 3 palettes, avec un aperçu `iframe sandbox` séparé et des vues 1100px / 390px. Exports : HTML autonome et mini-cahier des charges TXT. Aucun compte, aucune API, aucune publication automatique. Les e-mails fictifs ou invalides ne créent pas de lien de contact. Le produit commercial reste en préparation. Test de recette manuel : `node tests/web-builder.cjs`.

## LIV-04C — Atelier storyboard (06/11/2026)

La [démo Vidéo & audio](univers/outils/outils/atelier-video.html) permet de préparer les scènes d’un court récit, calculer les timecodes, préparer voix off et indications sonores, parcourir les scènes, exporter plan CSV, sous-titres SRT, script TXT et projet JSON réimportable. **Aucun fichier vidéo/audio ou musique n’est produit**, aucune API externe ni dépense. Tests locaux : `node tests/storyboard-studio.cjs`.

**Statut de publication LIV-04C (06/11/2026) :** le code et la recette sont prêts, mais Vercel retourne `402 / api-deployments-free-per-day` (100 déploiements API quotidiens). La page storyboard **n'est pas confirmée en production**. Le site public sert encore un ancien commit. Aucun achat ni réactivation d’automatisation. Les futures sessions devront privilégier un **seul commit GitHub final après recette**, puis contrôle SHA Vercel READY.

## LIV-04D — Matrice manuelle de sources (06/11/2026)

Le nouvel [atelier Recherche & analyse](univers/outils/outils/atelier-recherche.html) permet de comparer 2–4 options, saisir jusqu'à 12 sources, visualiser les contradictions et exporter un document Markdown, des données CSV et un projet JSON réimportable. Il ne consulte aucune source et ne prétend jamais vérifier les faits automatiquement. Liens intégrés au catalogue, aux pages de la banque et aux ressources. **Déploiement Vercel à confirmer**, quota journalier atteint lors de LIV-04C. Recette manuelle : `node tests/research-studio.cjs`.
