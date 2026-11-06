# Studio IA — session 01 : sécurité et publication

Date de référence : 6 novembre 2026 · Issue : https://github.com/cosscoll/testIA/issues/1

## Objectif et limites

Sécuriser la livraison du **prototype unifié**, sans toucher aux trois projets d'origine et sans rendre les produits payants publics. Ces actions protègent mieux le site ; elles ne constituent ni une certification de sécurité, ni une « sécurité parfaite ».

### Constats vérifiés avant modification

- Dépôt `cosscoll/testIA` **public** ; branche `main` **non protégée** à la date du contrôle.
- Déploiement de production réalisé depuis `main` sur Vercel.
- Aucun `vercel.json`, aucune `.vercelignore` et aucun workflow CI versionné dans le dépôt au départ.
- Cinq scripts de tests manuels existent : `smoke-static`, `offer-finder`, `product-depth`, `vault-offer` et `chat-contract`.
- Le code frontend, les démonstrations Three.js et les guides publics sont par nature accessibles aux visiteurs ; ils ne doivent **jamais** contenir de clés ou de contenu commercial secret.
- Le serveur `api/chat.js` valide déjà les messages et l'origine et vérifie que le modèle IA est à coût nul avant chaque génération. Ses limites en mémoire ne garantissent pas de quota distribué.

## Correctifs de configuration à vérifier sur le déploiement

`vercel.json` définit les en-têtes suivants pour les routes du site :

- `X-Content-Type-Options: nosniff` : limiter l'interprétation inattendue des types MIME.
- `Referrer-Policy: strict-origin-when-cross-origin` : limiter la fuite des chemins/paramètres dans les référents intersites.
- `X-Frame-Options: SAMEORIGIN` et `Content-Security-Policy: frame-ancestors 'self'` : refuser l'intégration du site sur des domaines externes.
- `Permissions-Policy` : désactiver caméra, micro, géolocalisation, API de paiement et USB non nécessaires.
- `Strict-Transport-Security` : demander HTTPS lors des visites ultérieures.
- CSP **minimale** (`base-uri 'self'; object-src 'none'; frame-ancestors 'self'`). **Ce n'est pas une CSP restrictive complète** : les ressources externes, les styles inline et le JavaScript historique exigent un audit navigateur avant une politique `script-src`/ `style-src` stricte.

Le fichier `.vercelignore` demande l'exclusion des tests, scripts manuels, documentation interne et README principal lors du déploiement. Les guides Markdown publics utilisés par `guide.html` sont préservés. **Le dépôt GitHub reste public, même si un fichier est exclu du site Vercel.** Cette règle ne remplace donc pas le stockage privé.

Documentation Vercel : https://vercel.com/docs/project-configuration/vercel-json et https://vercel.com/docs/deployments/vercel-ignore .

## Contrôles reproductibles

Sur une copie locale disposant de Node.js, lancer :

```sh
node scripts/verify-release.cjs
```

Le script exécute manuellement six contrôles, dont `tests/security-static.cjs` :

1. Vérification des en-têtes, de la CSP minimale et des exclusions Vercel.
2. Recherche indicative de noms de fichiers à risque et de quelques signatures de clés dans les fichiers texte du projet. **Ne couvre pas l'historique Git, les binaires ou les archives.**
3. Vérification des liens et de l'inventaire des ressources.
4. Simulation des deux étapes du guide de choix.
5. Simulation des onze ateliers et de l'ouverture du coffre.
6. Contrat de l'API IA avec des réponses simulées et sans appels payants.

Ce sont des contrôles de code et de configuration, pas des tests de pénétration. Aucune tâche périodique, workflow GitHub Actions ou autre consommation de quota n'est activée.

## Action nécessaire dans l'interface GitHub — pas automatisée

La connexion utilisée ici n'a pas l'autorisation d'administrer la protection de branche. Le propriétaire doit vérifier :

1. GitHub → dépôt `cosscoll/testIA` → **Settings** → **Rules** → **Rulesets** (ou **Branches**, suivant l'interface).
2. Cibler la branche `main` ; interdire la suppression et le force-push.
3. Demander une Pull Request et une validation avant fusion, avec un mode compatible avec l'équipe disponible. Ne pas créer une règle qui bloque toutes les futures publications sans personne capable d'approuver.
4. **Ne pas exiger de status check qui n'existe pas**. Si l'usage de GitHub Actions et de son quota est autorisé ultérieurement, intégrer les tests en CI et activer alors les checks requis.

Aucun de ces réglages administratifs n'est revendiqué comme appliqué.

## Contrôle de la version servie

Après chaque commit, comparer le SHA de `main` avec `meta.githubCommitSha` du déploiement Vercel et le statut `READY`. Vérifier sur une réponse **réelle** les en-têtes :

```sh
curl -I https://testia-unifie.vercel.app/
curl -I https://testia-unifie.vercel.app/produit.html?id=conciergerie
```

Vérifier que les fichiers de travail exclus ne sont pas servis (`/tests/security-static.cjs`, `/docs/SESSION_01_SECURITE_2026-11-06.md`). **Tester explicitement le statut HTTP 404** avant de déclarer l'exclusion effective.

## Risques ouverts

- `main` n'est pas protégée tant que le propriétaire ne l'active pas.
- Pas de tests automatiques bloquants avant la mise en ligne : choix volontaire pour respecter l'interdiction des automatisations et l'usage de quotas limités.
- La clé 3D charge Three.js depuis un CDN tiers ; analyser disponibilité, intégrité et CSP après recette visuelle.
- Le chatbot emploie des compteurs en mémoire : en serverless ils ne limitent pas les requêtes entre instances. Un stockage de rate limiting distribué reste à définir sans frais non autorisés.
- Les règles d'origine de l'API IA ne gèrent pas encore un domaine commercial personnalisé.
- Aucune recherche exhaustive de vulnérabilités ni de secrets historiques ; procéder à une inspection dédiée avant commercialisation.
- Une exclusion de déploiement ne suffit pas à protéger un fichier commité dans un dépôt public.
