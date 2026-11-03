# Inventaire public intégré — Studio IA (testIA)
Date : 3 novembre 2026
Projet cible : `cosscoll/testIA` — Vercel `testia-unifie`.

## Identité préservée

L'accueil conserve son identité **Obscure Pop** et ses **cinq étiquettes interactives** issues de Banque Outils IA. Les onze pages `produit.html?id=...` utilisent la clé Three.js et le coffre articulé du projet Pack Procédures Pro. Les trois dépôts de départ ne sont pas modifiés.

Les ressources sont regroupées dans **`ressources.html`** : le visiteur choisit une seule catégorie avant de découvrir ses ressources, plutôt que de voir un inventaire complet dès l'accueil.

## Produits — 11 références distinctes

| Famille | Offres | Statut |
|---|---:|---|
| Packs procédures | 1 : Conciergerie / locations courte durée | Pilote en validation métier ; 15 procédures et 7 registres annoncés dans le projet source |
| Banques d'outils IA | 6 : Rédaction, Visuels, Sites web, Vidéo & audio, Automatisation, Recherche & analyse | Offres en préparation ; aucun ZIP premium complet publié |
| Formations IAgile | 4 : Sites web 3D, Agents personnalisés, Automatiser une tâche, IA au quotidien | Présentations et exercices publics ; inscriptions non ouvertes |

Chaque fiche renvoie aux pages descriptives **réellement importées** sous `univers/` et, lorsque possible, à un essai gratuit. Aucune facturation ni livraison de fichier premium n'a été ajoutée.

## Ressources publiques — 26 entrées

### Procédures : 5
- Procédure gratuite P01 (fichier HTML existant)
- Atelier de décisions métier (HTML interactif existant)
- Scénographie 3D originale clé/coffre
- Mini-site de reproduction indépendante 3D, avec `demo.css`, `demo.js` et la même scène Three.js source
- Guide public de reproduction accessible via `guide.html?doc=cle` et son fichier source `reproduction-3d/README.md`

### Banque Outils IA : 13
- Générateur public de messages (pas de modèle IA connecté)
- Répertoire de 18 outils IA et fiches par usage
- Fiches de méthodes et de cas d'usage
- Guide interactif d'orientation et de priorités
- Cartographie IA interactive
- Démonstration initiale « L'IA utile »
- Démonstration AETHER
- Démonstration FORME
- Démonstration NOVA
- Démonstration THE WEB PRESS avec son moteur JavaScript compilé local
- Démonstration STUDIO 3D avec son modèle `.glb` local et scripts/style
- Guide de prompts FORME : `guide.html?doc=forme`
- Guide de prompts NOVA : `guide.html?doc=nova`

**Dépendance de THE WEB PRESS :** les quatre rendus Blender et le modèle volumétrique `.glb` dépassent la taille supportée par l'action GitHub utilisée pour copier les binaires. Les liens dans la page et le moteur pointent vers leurs originaux **sur le dépôt public source**, épinglés au commit `aa99fa1fc9106be179ae69e993a01849913df27e`. Le moteur compilé et la page sont copiés dans testIA. Il ne s'agit donc pas d'une copie entièrement autonome ; une connexion et un accès aux originaux sont nécessaires. Aucun fichier binaire n'a été remplacé par une fausse scène 3D.

### Formations IAgile : 8
- Diagnostic de démarrage en 10 questions
- Diagnostic d'utilisation et de temps net de l'IA
- Simulation locale d'un processus
- Incident Lab pour l'automatisation
- Diagnostic de création d'agent personnalisé
- Brief guidé pour site web 3D
- Comparateur public des quatre parcours
- FAQ publique des formations

La page originale IAgile possède une plateforme Academy de staging protégée : **elle n'est pas importée ou exposée publiquement**. Les ressources pédagogiques premium, comptes, progression personnelle, corrigés et documents privés ne figurent pas dans ce site.

## Pages et fichiers de navigation

- `index.html` : accueil Obscure Pop validé ; trois entrées visibles vers la bibliothèque, sans surcharge.
- `catalogue.html` : les onze offres avec filtres et recherche.
- `produit.html?id=...` : présentation par scène 3D et liens vers les détails.
- `ressources.html` : trois catégories, recherche ciblée, 26 documents/démos/exercices.
- `guide.html?doc=...` : lecteur sûr et accessible des trois guides Markdown locaux.
- `contact.html` : canal provisoire de retour public, pas de formulaire client privé.

## Contrôles effectués

- Inventaire : **11 produits / 26 ressources**, IDs uniques.
- Tous les liens de la bibliothèque pointent vers un fichier du dépôt.
- Les nouvelles pages importées ont été vérifiées statiquement pour les attributs `href` et `src` : aucun fichier local manquant dans ces références HTML.
- Les principaux scripts du catalogue, du guide et de la scène sont syntaxiquement valides.
- La copie du modèle STUDIO 3D conserve exactement le hash Git blob source.
- La publication Vercel et les tests visuels WebGL/mobile doivent être vérifiés sur la **dernière révision** ; l'outil de navigateur connecté Firecrawl ne dispose plus de crédits pour cette recette. Cela ne permet pas d'affirmer que toutes les animations ont été validées visuellement.

## Périmètre explicitement non publié

- Formation privée, progression des apprenants, studio de paiement, données personnelles ou CRM.
- Documents internes de fiscalité, budgets, sprints, facturation et architecture de sécurité.
- Archives volumineuses et fichiers Blender sources non nécessaires au fonctionnement public.
- Produits non documentés comme prêts à vendre ou prétendus résultats générés par une IA.

Les contenus détaillés du dépôt d'origine restent leurs références officielles. L'objectif est d'intégrer les **ressources publiques utiles**, non de transformer une archive de développement en catalogue commercial.

## Blocage de déploiement identifié

Au 3 novembre 2026, Vercel refuse la publication du dernier SHA de testIA : statut HTTP `402 payment_required`, quota gratuit `api-deployments-free-per-day` supérieur à 100 déploiements par jour. Le dernier déploiement production vérifié READY correspond au commit `e9031d1aead5503797ff5b2529f6bdd14f9d613d`, antérieur à cet inventaire. Les 26 ressources sont **dans GitHub** mais ne sont pas encore **toutes visibles en production**. Ne pas régler le blocage par une dépense, et ne pas prétendre qu'il est corrigé. Pour éviter une nouvelle saturation, grouper les modifications en commits peu fréquents lors du prochain cycle de publication.
