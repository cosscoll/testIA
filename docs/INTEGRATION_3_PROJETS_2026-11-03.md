# Intégration des trois projets dans testIA

Date : 3 novembre 2026.
Branche : \`cosscoll/testIA\` / \`main\`.
Site : https://testia-unifie.vercel.app/

## Périmètre livré

Le prototype rassemble les **onze offres publiques identifiées** dans les trois dépôts de départ : un pack procédures pilote, six banques d’outils IA en préparation et quatre formations IAgile dont les inscriptions ne sont pas ouvertes. L’intégration ne doit pas être interprétée comme la finalisation commerciale des produits.

### Pack Procédures Pro

| Produit public | Présentation | Démonstration |
|---|---|---|
| Conciergeries & locations courte durée — 15 procédures / 7 registres | \`univers/procedures/pack-conciergerie.html\` | \`univers/procedures/exemple-procedure.html\` |
| Atelier de décisions métier | \`univers/procedures/atelier-decisions.html\` | Exercices locaux, sans compte |
| Scénographie de la clé 3D jusqu’au coffre | \`univers/procedures/index.html\` | Module 3D conservé avec sa solution de repli |

Seul le pack Conciergerie est actuellement documenté dans le dépôt source comme offre pilote à présenter. Aucun autre pack commercialisable n’a été inventé.

### Banques d’outils IA

1. Rédaction & communication : \`univers/outils/pack-redaction.html\`
2. Design & visuels : \`univers/outils/pack-visuel.html\`
3. Sites web & prototypes : \`univers/outils/pack-sites-web.html\`
4. Vidéo & audio : \`univers/outils/pack-video-audio.html\`
5. Automatisation : \`univers/outils/pack-automatisation.html\`
6. Recherche & analyse : \`univers/outils/pack-recherche-analyse.html\`

Ressources publiques importées :
- \`univers/outils/outils/assistant-messages.html\` : générateur de messages gratuit, sans IA connectée.
- \`univers/outils/catalogue.html\` : répertoire des outils et usages.
- \`univers/outils/fiches.html\` : guides publics.

**Point important :** dans le dépôt source, les banques complètes sont des projets de produits en fabrication. Leur page de présentation n’équivaut pas à une banque d’outils payante, empaquetée et validée.

### Formations IAgile

1. Créer des sites web 3D animés : \`univers/formations/formations/sites-web-3d.html\`
2. Créer des agents personnalisés : \`univers/formations/formations/agents-personnalises.html\`
3. Automatiser une tâche fastidieuse : \`univers/formations/formations/automatiser-tache.html\`
4. Simplifier les processus du quotidien : \`univers/formations/formations/ia-au-quotidien.html\`

Autres pages : \`univers/formations/parcours.html\` (comparateur), \`univers/formations/faq.html\`, \`univers/formations/a-propos.html\`, \`univers/formations/ouverture.html\`. Exercices : \`univers/formations/ressources/index.html\` et les pages de diagnostic, brief 3D, agent readiness et incident lab.

Les cursus pédagogiques complets **ne sont pas importés** : le projet source prévoit leur hébergement privé avec contrôle d’accès serveur. Les contenus publics restent des présentations et démonstrations.

## Architecture unifiée

- \`index.html\` : écran d’accueil conservant la pile d’étiquettes réactives du site Banque Outils IA et trois catégories de collections.
- \`catalogue.html\` : catalogue unique, filtres par collection et recherche texte.
- \`produit.html?id=...\` : fiche de synthèse commune, conservée comme route d’information.
- \`assets/data.js\` : source unique des onze références publiques, statuts et liens vers les pages complètes.
- \`assets/site.js\` : rendu du catalogue, filtres, recommandations simples et navigation.
- \`univers/{outils,procedures,formations}/...\` : pages détaillées et expériences préexistantes, copiées dans le même domaine.
- \`assets/import-shell.css\` : navigation commune sur les pages importées.
- \`contact.html\` : canal de retour public provisoire via les Issues du dépôt testIA ; aucun email professionnel privé n’est encore configuré.

**Parcours optimisé :** accueil → catalogue filtré → page détaillée en un clic. Les fiches de synthèse conservent leur propre route pour consultation directe.

## Statut technique et limites

- Les trois dépôts d’origine ne sont pas modifiés.
- Le dépôt testIA fonctionne comme un site statique, déployé sur Vercel.
- Tous les liens \`href\` / \`src\` locaux des pages HTML intégrées ont fait l’objet d’une vérification par rapport à l’arborescence des fichiers.
- Les fichiers CSS ont été vérifiés pour les références locales, avec une exception de type URL fragmentaire interne au CSS 3D.
- Un contrôle HTTP des principales pages publiques a confirmé des réponses 200.
- Les animations 3D peuvent nécessiter WebGL et une bibliothèque externe ; les solutions de repli historiques sont conservées.
- **À tester visuellement sur appareils réels :** interactions au survol, 3D et transitions, mobile (390px), tablette (768px), ordinateur (1440px), clavier et lecteurs d’écran.
- **Non intégré** : paiement, abonnements, espace acheteur, comptes clients, authentification apprenants, cours privés, délivrance des produits numériques, chatbot IA génératif commun.

## Évolutions à traiter ensuite

1. Harmoniser davantage les pages détaillées des trois sources à la même direction graphique, sans casser les scènes 3D.
2. Compléter et valider les contenus commerciaux et les livrables des banques et packs.
3. Tester en navigateur la navigation complète et les interactions mobile.
4. Définir le contact professionnel, les offres/prix, la facturation et les modalités de livraison.
5. Concevoir un parcours de commande sécurisé seulement après validation juridique, technique et commerciale.

Ce document trace les sources réellement intégrées et différencie ce qui fonctionne comme une page publique de ce qui reste à développer avant une vente.
