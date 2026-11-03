# NOVA — Kit de prompts pour créer son site 3D

# NOVA — Prompt principal (utilisation guidée)

Je veux créer un site immersif 3D pour : **[mon activité]**. Mon offre est **[offre]**, ma cible **[cible]**, et la conversion recherchée **[action]**.

Travaille en quatre étapes indépendantes. Pour chaque étape, produis un livrable vérifiable avant de passer à la suivante :

1. **Conception** : lis `01-DIRECTION-ARTISTIQUE.md`. Propose trois concepts artistiques précis et choisis un objet 3D qui représente le service.
2. **Scène réelle** : lis `02-REALISATION-THREEJS.md`. Crée le site exécutable avec Three.js, des matériaux et un objet réellement volumétrique.
3. **Mouvements** : lis `03-SCROLL-HOVER.md`. Intègre les transformations liées au scroll et les interactions hover, clic et tactile.
4. **Contrôle / livraison** : lis `04-TESTS-PUBLICATION-0EURO.md`. Tester, corriger, publier si la publication gratuite est autorisée, puis vérifier le site en ligne.

**Règle irrévocable** : aucune dépense supplémentaire. Si une bibliothèque ne peut pas être utilisée légalement ou gratuitement, propose une autre solution. Pas de faux résultats de test ni de promesses de rendu premium automatique : le résultat est soumis à la validation visuelle.


---

# 01 — Direction artistique et concept de site immersif

À copier dans ChatGPT / Claude / Codex. Remplacer les éléments entre crochets.

> Tu es directeur artistique d'un studio spécialisé dans les expériences web 3D. Je dirige [nom], activité [secteur], offre [description], audience [cible], objectif principal [conversion].
>
> Avant d'écrire du code : propose trois concepts créatifs très distincts, chacun comprenant un objet ou environnement 3D qui **représente réellement l'activité**, un récit de 4 séquences au scroll, 5 interactions au hover/clavier/tactile, une identité typographique et chromatique originale, puis un risque technique et une solution mobile.
>
> Pour chaque concept, explique pourquoi la 3D améliore la compréhension, la confiance ou la conversion. N'utilise ni géométrie décorative gratuite ni copie d'un site tiers.
>
> Évalue chaque concept sur : impact visuel (5), clarté commerciale (5), originalité (5), faisabilité gratuite (5), compatibilité mobile (5).
>
> Recommande le meilleur et produis un storyboard de la page d'accueil, section par section. Demande uniquement les informations qui empêchent de commencer ; sinon formule des hypothèses explicites.

## Sortie attendue

Document conceptuel avec storyboard et critères vérifiables. Ne pas passer au code avant de valider le concept, y compris l'objet 3D et le déroulé du scroll.


---

# 02 — Implémentation 3D réelle

> Tu es développeur créatif senior Three.js et responsable de la performance WebGL. À partir du storyboard validé [coller le storyboard], crée un site réel avec une scène Three.js (ou React Three Fiber si la stack projet le justifie), et PAS une simulation CSS 3D.
>
> L'objet principal doit posséder une géométrie volumétrique lisible, une perspective, une caméra manipulable, plusieurs matériaux, éclairages, profondeur et occultation correctes, modèles chargés proprement, et un rendu de repli si WebGL manque.
>
> Évite le z-fighting : surfaces distinctes, depthBuffer, transparences maîtrisées, objets qui ne se traversent pas pendant les animations. Définis les contraintes géométriques de chaque transformation et crée un test de stabilité.
>
> Construis les animations (apparition, hover, drag, clic, scroll) autour d'actions utiles et de la démonstration du produit. Prévois clavier/tactile et prefers-reduced-motion.
>
> Fournis un projet exécutable complet, un README, les dépendances et versions exactes, un tableau licences/coûts. Ne choisis aucun service pouvant facturer. N'affirme pas que le rendu a été testé sur GPU si aucun navigateur GPU n'est disponible.

## Vérifications prioritaires

- Modèles originaux ou assets à licence vérifiée.
- Matériaux et éclairages testés sur un GPU normal.
- Trois états du modèle (fermé, ouvert, transformation) sans intersections indésirables.
- Résolutions 360, 390, 768, 1440 px.
- Fallback accessible, réduction de mouvement, navigation clavier et tactile.


---

# 03 — Chorégraphie scroll et hover

> Agis comme creative developer spécialiste GSAP/ScrollTrigger. Réalise une narration en 4 ou 5 séquences pilotées par la progression du scroll : installation, révélation de structure, passage en profondeur, transformation, reconstruction. Utilise une timeline avec progression déterministe (scrub) et des transitions sans sauts de caméra.
>
> Ajoute des interactions hover significatives : aimantation discrète sur boutons, rotation de produit contrôlée au pointeur, raycast sur parties du modèle pour afficher des explications, cartes en relief et matière réactive. Sur mobile, proposer des équivalents au tap et au scroll (pas de fonctionnalité exclusive au hover).
>
> Inclure par section une justification commerciale de l'effet (révéler une caractéristique, expliquer le service, inviter à une démonstration). Respecter prefers-reduced-motion, ne pas voler le scroll natif, garder les CTA accessibles, éviter les frames inutiles hors écran.
>
> Vérifier chacune des 5 étapes par capture et tester deux positions entre les étapes. Distinguer tests réels et hypothèses.

## Indicateurs d'acceptation

- Aucune traversée ou disparition incontrôlée des éléments 3D.
- Transitions scroll réversibles et reproductibles en remontant.
- Au moins 3 interactions testées au pointeur ET au tactile ou clavier.
- Pas de scroll-jacking, pas de dépassement horizontal.


---

# 04 — Audit, tests et publication sans coût

> Tu es QA front-end + intégrateur CI. Vérifie le projet sur 360, 390, 768, 1280 et 1440 px. Teste les liens, formulaires, boutons, menu, états de chargement, erreurs console, performance, WebGL avec et sans GPU, clavier, tactile, reduced-motion, visibilité des textes, alignement et lisibilité.
>
> Distingue les tests entièrement réalisés de ceux qui n'ont pas été possibles, en donnant pour chacun une preuve (capture, commande et résultat, SHA de commit ou URL).
>
> N'active aucune offre, API, facturation ou runner payant. Le compte GitHub doit conserver des budgets de dépassement à 0. Conserve le code source et les versions précédentes.
>
> Le dépôt GitHub modifié n'est pas une preuve de site publié : contrôler séparément l'URL après la publication. En cas d'échec, expliquer le blocage sans déclarer le succès.
>
> Fournis un récapitulatif lisible par un débutant avec un lien vers le site, les fichiers source et les prochaines améliorations.

## Prérequis

- Projet réalisable sans frais supplémentaires.
- Vérification de licences, notamment assets, librairies et éventuels fichiers de démonstration redistribués.
- Le client reste propriétaire de son contenu original, dans les limites des droits tiers.