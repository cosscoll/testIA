# Studio IA — sessions longues avec livraison visible sur le site
Mise à jour : 6 novembre 2026
Source de vérité : https://github.com/cosscoll/testIA/issues/9

## Règle de livraison

Une session de développement ne se termine pas par une idée, un document ou des fichiers non publiés. Chaque session doit produire une **fonctionnalité, un exemple d'utilisation, un contenu public substantiel ou une correction vérifiable sur un parcours réellement consultable** sur https://testia-unifie.vercel.app/.

Les étapes privées (production de packs, de prompts premium et de contenus payants) restent privées. Elles doivent être accompagnées d'un **aperçu gratuit utile, d'une démonstration autonome ou d'une amélioration du site**, sans publier la propriété intellectuelle commerciale.

### Contrat de sortie de chaque session

1. **Besoin couvert** : lien avec l'un des besoins du cahier des charges ou une issue existante.
2. **Livrable accessible** : URL exacte publique sur la version test, fonctionnement déterminé et limite de commercialisation clairement affichée.
3. **Modification réelle** : fichiers concernés, commit GitHub et absence de modification des trois dépôts sources.
4. **Tests** : tests statiques et fonctionnels pertinents ; confirmation de la synchronisation du commit GitHub avec un déploiement Vercel en état READY ; un déploiement READY n'est pas un test navigateur.
5. **Compte rendu** : capture et test manuel réels si un navigateur est disponible, résultat des tests, anomalies connues, prochain lot, commentaire dans l'issue de référence.
6. **Échec de publication** : déclarer la session *non livrée*, documenter l'obstacle, ne pas présenter un travail en local ou dans GitHub seul comme visible sur le site. Reprendre la livraison avant d'ouvrir un autre chantier.

## Ordre prioritaire par lots visibles

| Lot | Issue | Besoin du cahier des charges | Ce que le visiteur doit réellement constater |
| --- | --- | --- | --- |
| LIV-01 | #3 | Accès simple et direct à l'essai des 11 offres | Catalogue : bouton **Essayer l'atelier gratuit** indépendant sur chaque offre, utilisable après filtres et recherche. Publié en premier. |
| LIV-02 | #3 | Banque Rédaction pratique | **LIVRÉ :** 4 formats (e-mail, relance, publication et texte web), 3 exemples, 3 tons, 5 repères de relecture, édition, copie, export .txt et prompt IA facultatif. [Ouvrir l’atelier](../univers/outils/outils/assistant-messages.html). |
| LIV-03 | #3 | Banque Automatisation pratique | **LIVRÉ :** 3 scénarios métiers, étapes personnalisables, quatre simulations (complet, incomplet, doublon, autorisation), validation humaine fictive et exports JSON désactivé + TXT. [Ouvrir l’atelier](../univers/outils/outils/atelier-automatisation.html). Aucune automatisation réelle. |
| LIV-04 | #3 | Visuels, Web, Vidéo et Recherche | **A livré :** [Atelier Visuels](../univers/outils/outils/atelier-visuels.html) ; **B livré :** [constructeur web](../univers/outils/outils/atelier-sites-web.html) ; **C développé et testé sur GitHub, publication bloquée :** [storyboard Vidéo & audio](../univers/outils/outils/atelier-video.html) avec scènes éditables et exports CSV/SRT/TXT/JSON. Vercel : limite gratuite 100 déploiements API/jour (HTTP 402), SHA production non synchronisé. **D développé et testé dans GitHub, publication Vercel à confirmer :** [matrice Recherche & analyse](../univers/outils/outils/atelier-recherche.html), sources contradictoires et synthèses MD/CSV/JSON. |
| LIV-05 | #4 | Formation Sites 3D + Agents IA | Une vraie leçon publique par formation, avec exercice, corrigé/critères et fichiers non commerciaux. |
| LIV-06 | #4 | Formation Automatiser + IA au quotidien | Deux nouvelles leçons interactives complètes, évaluation simple et liens depuis les pages formation. |
| LIV-07 | #2 | Démontrer le pack Conciergerie v0.2 sans dévoiler le pack privé | Démonstration réelle d'un registre fictif de rotation, contrôles, export CSV d'essai, lien depuis la page Conciergerie. |
| LIV-08 | #5 | Parcours d'achat clair et expérience 3D fiable | Correctifs vérifiés sur mobile du catalogue et du coffre, CTA et fallback accessible, avant/après réellement contrôlé ; cinq étiquettes et clé/coffre conservés. |
| LIV-09 | #6 | Chatbot conseiller et contact utiles | Matrice de scénarios IA testés et repli local amélioré, puis contact privé seulement si destinataire/système configurés ; une amélioration visible même si l'IA externe est indisponible. |
| LIV-10 | #7 | SEO, accessibilité et performance | Métadonnées des fiches, structure et vitesse du site mesurées ; correctifs accessibles aux visiteurs ; pas de décompte arbitraire. |
| LIV-11 | #8 | Convertir en achat avec livraison | **Conditionnel** : uniquement lorsqu'un premier produit, le cadre juridique, la livraison privée et un prestataire de paiement sont validés. Ne jamais inventer de prix ni simuler une vente réelle. |

## Règles immuables

- Site unifié `cosscoll/testIA` uniquement, en conservant **cinq étiquettes interactives**, vraie **clé/coffre Three.js** et charte orange/crème validée.
- Aucun matériel commercial intégral sur GitHub public, aucune clé client ou secret dans le frontend.
- Aucune dépense, modèle IA payant ou automatisation horaire/quotas Work/Codex ; **aucun travail en arrière-plan**. Les lots sont réalisés lors de demandes de continuation.
- Les trois projets sources ne sont pas modifiés ; les achats et inscriptions restent désactivés jusqu'à validation des prérequis.
- Chaque nouveau lot possède son URL de recette. Les informations "préparation" ne valent pas livraison commerciale.

## Livraison initiale et validation

LIV-01 : `catalogue.html` charge `assets/catalogue-actions.css` et utilise `assets/site.js`. Les onze cartes exposent deux destinations indépendantes : **fiche 3D** et **atelier gratuit**. Les filtres restent opérationnels.

Contrôles : `node tests/catalogue-actions.cjs` puis `node scripts/verify-release.cjs` sur copie locale, comparaison SHA GitHub/Vercel READY, et contrôle visuel mobile lorsque le navigateur est disponible.

## Bilan LIV-02 — 6 novembre 2026

- **URL publique :** https://testia-unifie.vercel.app/univers/outils/outils/assistant-messages.html
- **Également accessible depuis :** vitrine Rédaction https://testia-unifie.vercel.app/univers/outils/pack-redaction.html et bibliothèque des ressources.
- **Ce qui a changé :** interface du générateur entièrement revue, 4 formats × 3 tons, 3 cas métier, preuve facultative, 5 alertes de qualité, copie, export .txt, prompt IA éditable, conseiller du site préservé. Aucun contenu premium publié.
- **Contrôles de comportement :** 67 validations par simulateur DOM/JS ; tests de l'atelier dans `tests/message-studio.cjs` ; le contrôle global manuel `scripts/verify-release.cjs` inclut désormais ce fichier.
- **Restrictions :** générateur de modèles déterministe, **sans IA générative connectée**, sans compte, sans paiement ni publication automatique ; relecture et exactitude restent à la charge de l'utilisateur. Recette mobile visuelle sur navigateur réel à effectuer.
- **Critère de publication :** comparer la branche `main` et le déploiement Vercel `READY` avant de marquer la livraison finale (à vérifier après ce commit).

## Bilan LIV-03 — 6 novembre 2026

- **Nouvelle URL** : https://testia-unifie.vercel.app/univers/outils/outils/atelier-automatisation.html
- **Intégrations** : CTA sur la page Banque Automatisation, accès direct depuis les fiches du produit 3D et ajout à la bibliothèque des ressources.
- **Fonctionnalité** : trois modèles (demande de devis, stock, document), étapes éditables (1–5), construction d’un flux comprenant trois contrôles bloquants et une validation humaine, quatre essais fictifs, journal détaillé, export JSON `enabled:false` et guide .txt.
- **Règles** : aucune donnée envoyée à un serveur, aucun cron, pas de compte connecté, ni installation d’automatisation ; tout résultat est purement pédagogique.
- **Test manuel** : `node tests/workflow-studio.cjs` avec moteur, scénarios et interactions ; intégré à `node scripts/verify-release.cjs`. Les validations visuelles mobile restent séparées.
- **Confirmation publication** : vérifier SHA de `main` et le déploiement Vercel `READY` avant de considérer le lot terminé.

## Bilan LIV-04A — Atelier de création visuelle, 6 novembre 2026

- Démonstration publique : https://testia-unifie.vercel.app/univers/outils/outils/atelier-visuels.html
- Depuis la vitrine : https://testia-unifie.vercel.app/univers/outils/pack-visuel.html
- Trois cas métiers fictifs, trois compositions (éditoriale, bicolore, centrée), trois palettes d'affiche, carré et portrait, cinq repères de relecture et contrastes calculés, export SVG/PNG et brief TXT.
- Contenu SVG échappé (aucun texte utilisateur interprété comme balise), contenu construit uniquement sur le navigateur et aucune image externe. Les éléments prêts à diffuser demandent encore une relecture humaine.
- Module et liens intégrés à la banque, au catalogue de produits et aux ressources. Aucun visuel premium ni contenu commercial intégral n'a été publié.
- Tests : `tests/visual-studio.cjs` ; tests manuels globaux dans `scripts/verify-release.cjs`. Vérification du déploiement SHA/Vercel READY à consigner en fin de session.
- **LIV-04 non entièrement achevé** : trois banques à outiller (Web, Vidéo & Audio, Recherche & Analyse). La présente session a pour résultat visible le studio Visuels.

## Bilan LIV-04B — Atelier Sites web & prototypes, 6 novembre 2026

- **Atelier public :** https://testia-unifie.vercel.app/univers/outils/outils/atelier-sites-web.html
- **Page produit :** https://testia-unifie.vercel.app/univers/outils/pack-sites-web.html
- Trois cas métiers (artisan, consultant, studio créatif), trois compositions (éditoriale, services, portfolio), trois palettes, contenu editable, six repères de relecture, aperçu isolé dans une iframe sans script, vue desktop réelle de 1100px et vue mobile de 390px, et exports HTML/TXT.
- Le fichier généré est une page autonome statique comprenant sections Offre, Pour qui et Contact. Le lien email est désactivé lorsque l'adresse est fictive ou invalide ; aucun formulaire ou paiement factice.
- Pas d'API, d'hébergement automatique, d'exécution de scripts générés ni de publication de données sensibles. Le fichier HTML doit être relu avant mise en ligne et complété selon les obligations applicables.
- Liens ajoutés à la banque, aux pages produit et à la bibliothèque de ressources. **LIV-04C/D** restent à réaliser ; le kit premium reste en préparation.
- Recette ciblée : `node tests/web-builder.cjs` et manuel `node scripts/verify-release.cjs` ; contrôle de déploiement GitHub SHA/Vercel READY exigé avant affirmation de mise en ligne.

## Bilan LIV-04C — Atelier Storyboard vidéo & audio (6 novembre 2026)

- URL publique prévue : https://testia-unifie.vercel.app/univers/outils/outils/atelier-video.html
- Page produit : https://testia-unifie.vercel.app/univers/outils/pack-video-audio.html
- Trois exemples métiers fictifs, jusqu’à huit scènes, durées totales plafonnées à 90 secondes, textes, descriptions des plans, voix off, indications sonores, réorganisation et navigation plan par plan.
- Exports locaux CSV (plans), SRT (sous-titres dérivés de la narration), TXT (script) et JSON de travail réimportable, avec contrôles de qualité et neutralisation des formules dans les CSV.
- Aucun fichier vidéo ou audio généré, aucune musique, aucun média tiers, aucune tâche périodique ou API utilisée. Contenu payant complet toujours privé et en préparation.
- Test manuel : `node tests/storyboard-studio.cjs` ; intégré à `scripts/verify-release.cjs`. Vérifier le commit GitHub = Vercel production READY avant déclaration de publication.
- LIV-04D reste à créer : banque Recherche & analyse.

## Incident de publication — LIV-04C (6 novembre 2026)

- Code et tests présents sur `cosscoll/testIA`, branche `main`. **85 vérifications de scénario réussies** en JavaScript/DOM simulé.
- **Non livré sur le domaine Vercel** à ce stade : production au SHA `ef59a1895851cd21bc3cce44997d9e3f9ecf686e`, branche GitHub au SHA `8d9f0d77be9760c817b46206cf853ed32926e526` lors du contrôle.
- Tentative de publication explicite via Vercel : erreur `402 payment_required`, code `api-deployments-free-per-day`, limite des 100 déploiements/jour atteinte. Aucun paiement, aucun changement d'offre.
- L'environnement local n'a pas de CLI Vercel et ne peut pas joindre GitHub par réseau pour réaliser une solution de contournement autorisée.
- **Aucune session ne doit être déclarée publiée tant que le SHA de production n'est pas le dernier SHA GitHub en état READY.**
- À la prochaine publication autorisée, déployer une seule version consolidée et vérifier le lien direct ; conserver le site existant et les trois dépôts d'origine inchangés.
- Pour limiter l'épuisement du quota : **préparer, tester et rassembler les fichiers avant de pousser ; un commit atomique par session en priorité**, au lieu de pousser chaque composant au fur et à mesure. Pas de tâches automatiques ou périodiques.

## Bilan LIV-04D — Matrice Recherche & analyse (06/11/2026)

- **Page cible (après déploiement) :** https://testia-unifie.vercel.app/univers/outils/outils/atelier-recherche.html
- Deux à quatre options, jusqu’à douze observations modifiables ; trois jeux d’exemples explicitement fictifs ; arguments favorables/contraires/contexte, dates et URL facultatives, déclaration de consultation.
- Synthèse Markdown, CSV neutralisant les formules, JSON exportable et réimportable. Six contrôles de présence, aucun gagnant calculé.
- Aucune source consultée ni vérifiée automatiquement, aucun compte externe ou API connecté. Ce prototype ne doit pas être décrit comme moteur de recherche ou comparateur de vérité.
- Les liens vers l’atelier sont préparés sur les pages produit 3D, la vitrine Recherche & analyse et la bibliothèque (42 ressources).
- Recette ciblée : `tests/research-studio.cjs` ; inclus dans le lanceur manuel `scripts/verify-release.cjs`.
- **Publication Vercel non confirmée tant que `main` n’est pas le SHA Vercel production READY.** Le quota gratuit a bloqué LIV-04C ; aucune facturation ne doit être lancée pour forcer un déploiement.
