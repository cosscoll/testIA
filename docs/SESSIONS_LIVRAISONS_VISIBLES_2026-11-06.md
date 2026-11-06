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
| LIV-04 | #3 | Visuels, Web, Vidéo et Recherche | **LIV-04A — Visuels livré** : studio local (3 mises en page, 3 palettes, formats 1080 × 1080 / 1080 × 1350, aperçus, exports SVG/PNG et brief), [ouvrir l’atelier](../univers/outils/outils/atelier-visuels.html). **LIV-04B/C/D restant** : Web, Vidéo, Recherche. |
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
