# Studio IA — Sprint de fiabilisation (5 novembre 2026)

Dépôt cible : cosscoll/testIA, branche main. Aucune modification aux trois dépôts sources. Charte CONTROL proposition 03 inchangée. Aucun paiement, abonnement, automatisation récurrente ni génération IA déclenchée pour ce sprint.

## Changements

### 1. Finale clé et coffre — petits écrans
La finale avait une hauteur limitée à l'écran, une hauteur minimale de 650 pixels, un débordement masqué et une grande marge intérieure en haut sur mobile. Sur écran bas, cela pouvait tronquer les liens et la description du produit. Le nouvel habillage utilise une hauteur adaptative, un débordement visible et une disposition des contenus en bas de la section. Le modèle WebGL, les positions de la clé et la programmation du coffre ne sont pas modifiés.

Si WebGL n'est pas disponible ou si l'utilisateur préfère réduire les animations, le statut affiche désormais « Coffre — aperçu statique ». Il ne prétend plus que la serrure a tourné lorsque la scène est fixe. Un statut inchangé n'est plus réannoncé à chaque défilement. Le texte des scènes devient sélectionnable.

### 2. Contact — conserver un brouillon sans GitHub
La page Contact permet de copier un brouillon local avec son sujet et son message, sans les envoyer ni les enregistrer côté serveur. Le navigateur utilise son presse-papiers ; s'il n'est pas disponible, un champ sélectionnable est proposé. L'option d'Issue GitHub publique est maintenue et explicitement identifiée. Le doublon de Ressources dans le menu mobile de Contact est supprimé.

Cette solution ne constitue pas un formulaire de contact privé. Il faudra vérifier un destinataire professionnel et choisir un service de traitement approprié avant le lancement commercial.

### 3. Conseiller IA — statut rapide, sécurité préservée
L'endpoint GET /api/chat renvoie immédiatement « not_configured » si aucune authentification n'est définie ; il ne contacte plus inutilement le fournisseur. Pour toute génération réelle via POST, la vérification du tarif du modèle reste effectuée avant l'appel. Si le modèle n'est pas attesté gratuit, aucune génération n'est lancée.

Aucune activation d'un modèle payant, d'un plan Vercel payant ou de crédits supplémentaires.

### 4. Guides publics
Les liens Markdown sont convertis en liens cliquables sans injection d'HTML provenant du document. Les chemins relatifs se résolvent depuis le fichier Markdown ; seuls HTTP et HTTPS sont autorisés. Les sites externes utilisent noopener et noreferrer.

### 5. Tests et contrôles
- **node tests/smoke-static.cjs** vérifie aussi les références locales de toutes les pages HTML importées, et les composants Contact, fallback 3D et guide.
- **node tests/chat-contract.cjs** simule les requêtes serveur du chatbot sans réseau, sans génération et sans jeton : état sans clé, rejet des demandes invalides, rejet des origines externes, parsing des recommandations.

Contrôles effectués pendant le sprint :
- **44 pages HTML** analysées dans GitHub pour les chemins locaux href et src : **aucun fichier manquant** dans ces références.
- API simulée : GET sans clé = non configuré, POST invalide = 400, POST sans clé = 503, origine interdite = 403, sans aucun appel réseau.
- Copie locale simulée : brouillon copié dans le presse-papiers, sans soumission de formulaire.
- Syntaxe JavaScript validée sur les scripts modifiés ; accolades CSS équilibrées.

## Limites et suite
Le domaine Vercel n'a pas pu être ouvert dans un navigateur de test depuis cet environnement (résolution DNS indisponible). Ne pas présenter les performances GPU, le responsive ou l'accessibilité comme vérifiés visuellement. Les tests statiques ont été ajoutés au dépôt, mais leur exécution complète en Node depuis une copie locale reste également nécessaire.

Travaux suivants : formulaire privé et identité légale vérifiée, finalisation des produits, stratégie SEO, validation d'affichage en 360/390/768/1440 px, performance WebGL mobile, disponibilité réelle du modèle gratuit.

## Recette manuelle recommandée
1. Sur un téléphone, ouvrir la fiche Conciergerie et utiliser l'accès direct puis la clé 3D jusqu'au coffre.
2. Répéter sur une formation, vérifier que les informations et liens du coffre ne sont pas coupés.
3. Sur Contact, vérifier le menu mobile et tester la copie d'un message fictif.
4. Sur Guide, vérifier les liens Markdown si présents.
5. Avec WebGL désactivé ou réduction des animations, vérifier le statut d'aperçu statique.
6. Si le modèle gratuit est indisponible, vérifier qu'aucune génération n'est lancée et que l'accès au catalogue apparaît.
