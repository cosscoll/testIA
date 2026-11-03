# FORME® — Pack de prompts (échantillon)

Ce pack est une démonstration de la méthode de la Banque Outils IA. Il fournit quatre étapes pour créer et vérifier son propre site. Les liens vers des bibliothèques tierces ne constituent pas un droit de redistribuer leur code ou leurs assets.


---

# Prompt 01 — Brief et direction artistique

Copie ce prompt dans ChatGPT, Claude, Gemini, Codex ou un autre assistant capable d'écrire du code. Remplace les zones entre crochets.

> Tu es directeur artistique spécialisé dans les expériences web interactives. Je veux créer un site pour [ENTREPRISE / ACTIVITÉ]. Mon public est [CIBLE] et mon objectif principal est [PRISE DE RDV / VENTE / CONTACT / IMAGE]. Je souhaite une esthétique proche du niveau d'ambition d'une agence créative immersive, mais **sans reproduire** le code, les éléments ou les visuels des références.
>
> Conçois trois territoires artistiques radicalement différents, chacun avec : une idée directrice claire, une palette précise, des typographies accessibles gratuitement, une scène 3D **qui représente le produit/service**, trois interactions liées à la souris, une séquence au scroll en quatre phases, une adaptation tactile, une solution accessible sans WebGL et les risques techniques.
>
> N'utilise pas de géométrie aléatoire sans signification. Le site doit rester lisible, vendeur et performant.
>
> Budget logiciel supplémentaire : **0 €**. N'active ni API payante ni fonctionnalité pouvant entraîner une facturation. Précise toute licence à vérifier avant de réutiliser un outil.
>
> Attends mon choix de direction artistique avant de produire le code.

**Résultat attendu :** trois pistes de direction artistique et un choix argumenté pour la scène 3D.


---

# Prompt 02 — Construire la première vraie scène 3D

> Tu es développeur créatif WebGL senior. Utilise le brief et la direction artistique validés plus haut. Construis un **prototype réellement testable** d'une section d'accueil avec un objet 3D lié au métier. Utilise Three.js / React Three Fiber si la configuration et les licences le permettent, sinon WebGL natif en expliquant le compromis. Ne confonds jamais CSS `transform: rotateY()` avec un moteur 3D complet.
>
> Le prototype doit inclure : géométries ayant une profondeur physique, caméra perspective, matériaux, éclairages, test de profondeur (depth testing), séparation des surfaces pour éviter le z-fighting, mouvement inertiel à la souris, contrôle tactile, animation temporelle, état au clic et fallback pour les appareils incompatibles.
>
> **Attention aux défauts des prototypes précédents** : aucune surface 3D ne doit traverser une autre sans justification ; éviter les faces coplanaires, vérifier les normales, `depthWrite` / `depthTest`, synchroniser les mises à jour entre effets et transitions. Limiter les mouvements sur mobile.
>
> Génère le code complet, exécute les tests disponibles et indique clairement les limites de test matériel. N'ajoute aucune API facturée ou dépendance commerciale sans vérifier son usage.
>
> Donne-moi une page que je peux tester immédiatement. **Ne passe pas au reste du site avant que cette scène soit validée visuellement.**

**Résultat attendu :** un premier hero 3D fonctionnel et démontrable, pas une page entière remplie d'effets approximatifs.


---

# Prompt 03 — Animation au scroll, hover et transitions

> Travaille à partir du prototype approuvé, sans changer arbitrairement sa direction artistique. Crée un parcours de 4 à 5 chapitres visuels où le scroll manipule la caméra ou l'objet 3D, avec continuité spatiale. L'utilisateur doit pouvoir revenir en arrière sans saut, trou ou téléportation.
>
> Pour chaque chapitre, donne : son objectif narratif, l'état initial/terminal des objets 3D, le mouvement caméra, les animations texte et l'interaction souris/tactile/clavier. Les transitions doivent être pilotées par une progression de 0 à 1. Les animations doivent rester synchronisées dans les deux directions de défilement.
>
> Ajoute des hover distincts : réponse magnétique des boutons, inclinaison contrôlée des cartes, éclairage qui suit le curseur, révélation du contenu, état au clic, transitions temporelles maîtrisées. Sur tactile, propose des alternatives claires. Respecte `prefers-reduced-motion`.
>
> Effectue une recette visuelle et fonctionnelle sur 360, 390, 768, 1440 et 1920 px, teste le clavier, le scroll avant/arrière, le survol, les clics, les animations répétées et les erreurs JavaScript. Corrige avant publication. Aucun coût supplémentaire.

**Résultat attendu :** une expérience fluide, accessible et cinématique, sans animation gadget.


---

# Prompt 04 — Vérifier et publier sans frais

> Audite le site final comme un ingénieur QA indépendant. Vérifie : fonctionnement de chaque bouton, formulaire, navigation, popup et lien ; WebGL activé/désactivé ; 3D sans traversées de surfaces ni scintillement ; charge CPU/GPU ; chargement initial ; scroll bidirectionnel ; hover/tactile ; responsive ; SEO ; accessibilité WCAG ; `prefers-reduced-motion` ; sécurité ; crédits et licences.
>
> Exécute les tests réellement accessibles dans cet environnement. Ne prétends pas qu'un test navigateur GPU est passé s'il n'a pas pu être exécuté. Établis une liste **PASSÉ / NON TESTÉ / ÉCHOUÉ** avec preuves.
>
> Si l'utilisateur a autorisé la publication, vérifie que le dépôt cible est le bon, que l'hébergement et les actions sont gratuits, puis déploie. **Ne remplace aucun autre site** et ne confonds pas commit GitHub avec publication. Ouvre la véritable URL de production et constate que les changements y sont visibles. Si impossible, fournis les fichiers et la marche à suivre.
>
> Coût supplémentaire maximal : 0 €. Aucune carte bancaire, aucun dépassement à l'usage, aucune API payante.

**Résultat attendu :** un site testé, un rapport honnête et une version accessible sans surprise financière.


---

# FORMЕ — Prototype d'offre commerciale Studio Web 3D

## Proposition de valeur testée

**Une bibliothèque accompagnée de prompts guidés et d'exemples fonctionnels**, pour permettre à un entrepreneur ou indépendant de construire son site en utilisant un assistant IA. Ne pas vendre « 261 liens GitHub » sans méthode, démonstration et support pédagogique.

## Contenu du pack de démonstration

- `index.html` : preuve de concept de site original avec véritable scène WebGL, aperçu de secours, interactions au scroll/hover, configurateur et générateur de prompts.
- `scene.js` et `app.js` : code source séparé pour apprendre et modifier (le HTML de démonstration contient aussi ces fichiers intégrés afin de fonctionner hors ligne).
- `prompts/01...04` : parcours progressif du brief à la mise en ligne.
- `docs/QUALITE-ET-LICENCES.md` : règles de test et de réutilisation.

## Parcours client proposé

1. Choisir son activité et sa palette dans la démo. Copier le prompt personnalisé.
2. Avec le **Prompt 01**, valider une direction artistique propre au client.
3. Avec le **Prompt 02**, produire une première scène 3D réelle et la faire valider.
4. Avec le **Prompt 03**, ajouter les animations scroll et les interactions.
5. Avec le **Prompt 04**, vérifier responsive, qualité, licences et publication.

## Ce que ce prototype ne prouve PAS

- Il ne démontre pas que n'importe quel débutant obtiendra immédiatement un résultat proche d'une agence primée.
- Il ne constitue pas une étude de marché ou une validation de disposition à payer.
- Il ne permet pas de revendre automatiquement les 261 ressources tierces, les assets ou les bibliothèques.
- Ce n'est pas un hébergement client ni un générateur de sites par API. Les prompts sont exécutés dans un outil IA externe dont les quotas/abonnements dépendent du client.

## Validation commerciale à faire avant vente

- Proposer à 3 à 5 testeurs non développeurs de suivre le pack sans aide directe.
- Mesurer réussite du premier prototype, temps, difficultés, frais et qualité du résultat.
- Vérifier licences de TOUTES les ressources effectivement redistribuées ; fournir liens et attribution adaptés.
- Définir un périmètre, un support, une politique de mise à jour et un prix après test utilisateur.

## Coûts

Le présent prototype ne nécessite **aucune dépense supplémentaire** pour être exécuté localement. Les services externes utilisés par les clients restent indépendants et doivent être examinés un par un avant engagement.