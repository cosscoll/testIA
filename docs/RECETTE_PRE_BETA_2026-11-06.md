# Studio IA — recette de la bêta fermée (6 novembre 2026)

**Seul dépôt modifié :** `cosscoll/testIA` / `main`.
**Site cible :** https://testia-unifie.vercel.app
**Questionnaire :** https://testia-unifie.vercel.app/beta.html

## Ce qui est intégré au site
- Questionnaire `/beta.html` : 5 missions et résultats « réussie / difficile / bloquée ».
- Contexte matériel, note de facilité (1–5), trois commentaires libres ; génération et copie / téléchargement TXT **sur l'appareil**, sans base de données ni transmission automatique.
- Page Contact modifiée : suppression du formulaire qui soumettait vers les Issues GitHub publiques. Brouillon local uniquement ; accès au questionnaire depuis Contact et les pieds de page accueil/catalogue.
- Aucun paiement, aucune inscription et aucun transfert de rapport aux services de l'équipe. Le participant remet son fichier volontairement par un **canal privé convenu avant le test**.

## Vérifications déjà effectuées sur la branche
- **37 tests du questionnaire** (contrôle fonctionnel JavaScript et DOM simulé), dont progression, export TXT, copie, aucun appel réseau et lien Contact.
- **51 pages HTML / 1 220 références internes statiques** contrôlées : aucune référence locale manquante détectée.
- **50 fichiers JavaScript classiques** analysés syntaxiquement sans erreur. Le fichier `univers/outils/demo/studio-3d/main.js` est un module ES6 non traité par ce contrôle de syntaxe classique.
- **41 fichiers** sous `api/`, `assets/`, `docs/` contrôlés contre des signatures connues de secrets (PEM, jetons courants GitHub/AWS/Stripe/Slack) : aucun motif trouvé. Ne vaut pas audit de l'historique Git ni analyse de sécurité complète.
- Vérification du code : le fallback statique, la préférence de mouvement réduit et l'atelier direct existent pour la page produit 3D. Leur comportement visuel **n'a pas encore été validé dans le navigateur du site en production**.
- Suite complète de recette ajoutée à `node scripts/verify-release.cjs`. **Elle doit être exécutée sur une copie du dépôt avec Node** ; la validation ciblée du questionnaire ne prouve pas que tous les tests sont verts.

## Procédure GO / NO GO avant invitation
1. Vérifier que le SHA `main` est **exactement égal** à `meta.githubCommitSha` sur Vercel production `READY`. Ne pas se contenter d'un état READY sur une ancienne version.
2. Ouvrir, sans connexion, `/beta.html`, `/index.html`, `/catalogue.html`, la fiche `/produit.html?id=redaction`, et les ateliers Rédaction, Vidéo et Recherche.
3. À 360, 390, 768 et 1440 px : ouvrir menu, filtres, CTA ; vérifier absence de débordement horizontal, focus visible, navigation clavier et tactile.
4. Tester la clé et le coffre jusqu'au module de conversion ; tester `prefers-reduced-motion` et une session sans WebGL, sans masquer les liens d'atelier.
5. Dans chaque atelier visé : modifier, copier, télécharger et recharger un fichier quand disponible.
6. Vérifier le conseiller IA : s'il ne dispose pas du **modèle gratuit**, le message doit être clair et le catalogue / guide doit rester utilisable. Aucun fournisseur payant ne peut être activé.
7. Sur `/beta.html`, marquer une mission bloquée, remplir un retour, télécharger et relire `studio-ia-retour-beta.txt`. Ne pas envoyer ce fichier à une Issue GitHub publique.
8. Exécuter localement `node scripts/verify-release.cjs`, analyser les résultats. Valider aussi en HTTP que `/tests/`, `/docs/` et les fichiers privés ne sont pas servis.

**Décision :** pas d'invitation à un bêta-test totalement autonome tant que les étapes 1–8 n'ont pas été validées sur le site réellement déployé. Pour un test accompagné, annoncer explicitement les limites.
**Interdictions inchangées :** aucune automatisation récurrente, aucun coût, aucun changement des trois dépôts sources ni exposition de ressources premium.
