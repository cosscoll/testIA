# Conseiller IA unifié — testIA
Version : 2026-11-03. Dépôt : `cosscoll/testIA`. Site : https://testia-unifie.vercel.app/

## Objectif
Reprendre le véritable assistant génératif de `cosscoll/Banque-Outils-IA` et le généraliser à la plateforme réunissant :
- **Packs procédures** : le pack pilote Conciergerie (15 procédures, 7 registres).
- **Banques d’outils IA** : Rédaction, Visuels, Sites web, Vidéo, Automatisation, Analyse.
- **Formations IAgile** : Sites web 3D, Agents IA personnalisés, Automatiser une tâche, IA au quotidien.

Le conseiller répond à une question libre, peut clarifier un besoin et propose jusqu’à deux produits appartenant éventuellement à des catégories différentes. Les recommandations sont des liens vers les véritables pages présentes sur le même domaine. Aucun prix ou achat inventé.

## Architecture
- `assets/unified-advisor.js` : interface, bulle flottante, échanges multi-tours, accord explicite, cartes de recommandation. Adaptation du code historique de Banque Outils IA.
- `assets/unified-advisor.css` : style Obscure Pop, responsive et accès clavier.
- `assets/data.js` : les 11 offres et les liens autorisés (fournis aussi à toutes les pages importées).
- `api/chat.js` : fonction Vercel Node.js, authentification côté serveur via OIDC Vercel ou clé serveur, catalogue fermé de 11 offres, contrôles de requêtes, appel à l’IA et extraction des recommandations.

La bulle s’affiche sur **33 pages HTML**. L’accueil comporte aussi un bouton visible « Être guidé par le conseiller IA ».

## Réponses réellement générées
L’API utilise le modèle `reflection/beam-free`, sans réponse préenregistrée ni bascule automatique sur un autre modèle. Le prompt serveur contient les limites commerciales réelles, distingue les trois produits et demande au modèle de poser une question si le besoin est trop vague. Le modèle ne passe aucune commande et ne consulte aucun compte client.

**Protection stricte contre les dépenses de modèle :** avant chaque GET de santé et chaque POST de génération, le serveur interroge le catalogue public de modèles Vercel. La requête de génération n’est lancée **que si le prix d’entrée et de sortie annoncé est exactement zéro**. Si le modèle ou la vérification est indisponible, l’API répond `503 free_model_unavailable` et ne contacte pas le service de génération. Aucun fallback payant. Cette vérification est volontairement restrictive ; elle peut bloquer les réponses lorsque la liste des modèles est inaccessible ou mal formatée.

## Confidentialité et limites
- Aucune clé API dans le navigateur, GitHub ou les pages publiques.
- Consentement explicite nécessaire avant d’envoyer le texte du visiteur au fournisseur IA.
- Historique de conversation limité en taille et transmis uniquement pendant la session de dialogue ; pas de stockage des échanges dans l’application.
- Conseiller d’orientation, pas service client capable d’agir sur les commandes, comptes, accès ou paiements.
- Pas de cours privés ou ZIP commerciaux dans l’index. Les produits non commercialisés restent clairement marqués.
- Limitations par IP/instance de fonction, protection d’origine et validation des tours ; des limites centralisées seraient nécessaires pour une vraie ouverture à fort trafic.

## Vérifications faites
1. Syntaxe JS de l’API et du script de conversation validée.
2. Fonctions de validation et extraction de recommandations contrôlées avec les 11 IDs autorisés.
3. Test simulé du trajet POST → modèle → réponse : `200`, deux offres de familles différentes correctement liées.
4. Test de refus si le modèle devient payant : `503`, zéro appel de génération.
5. Inspection de l’intégration des ressources JS/CSS sur 33 pages et vérification des chemins relatifs.
6. Déploiements GitHub vers Vercel en statut `READY`.

**Limite de recette :** une interaction réelle POST avec l’IA déployée n’a pas pu être observée automatiquement dans cette session ; ne pas la déclarer vérifiée en production avant ce test. Un contrôle final en navigateur est nécessaire, en particulier sur mobile. Tester une question sur les packs, une sur les banques et une sur les formations ; vérifier que les liens restent sur `testia-unifie.vercel.app`.

## Scénarios de test utilisateur
- « Je gère des locations courte durée et mes prestataires oublient des étapes. » → devrait présenter le pack pilote Conciergerie, sans inventer un autre pack.
- « Je veux apprendre à développer des agents IA, pas seulement les utiliser. » → formation Agents personnalisés.
- « Je cherche à préparer des posts pour mes réseaux sociaux. » → banque Rédaction et outil gratuit.
- « Je veux automatiser mon travail mais je ne sais pas par où commencer. » → question de clarification ou comparaison banque Automatisation / formation Automatiser une tâche.
- « Je peux acheter maintenant ? » → non ; offres en préparation, sans achat actif.
