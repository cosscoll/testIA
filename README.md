# Studio IA — prototype de plateforme unifiée

**Site de test :** https://testia-unifie.vercel.app/  
**Dépôt de travail :** `cosscoll/testIA` — branche `main`  
**Documentation de l’intégration :** [Inventaire complet des trois projets](docs/INTEGRATION_3_PROJETS_2026-11-03.md)

Ce prototype rassemble les contenus publics de trois projets dans une même plateforme, sans modifier leurs dépôts d’origine.

## Direction UX actuelle — refonte v2

La navigation publique est désormais organisée par choix progressif : **Accueil → trois catégories → offres de la catégorie → fiche courte**, avec accès aux anciens contenus détaillés uniquement sur demande. Les trois étiquettes interactives et la charte éditoriale sont définies dans `assets/platform-v2.css` et `assets/platform-v2.js`.

Consulter [le dossier complet de la refonte UX](docs/REFONTE_UX_V2_2026-11-03.md). Les trois dépôts d'origine restent inchangés. Le chatbot est conservé, mais sa correction est différée.

## Les 11 offres représentées

- **Packs Procédures Pro (1)** : pack pilote Conciergeries et locations courte durée.
- **Banques d’outils IA (6)** : Rédaction, Visuels, Sites web, Vidéo & audio, Automatisation, Recherche & analyse.
- **Formations IAgile (4)** : Sites web 3D, Agents personnalisés, Automatiser une tâche, IA au quotidien.

## Navigation du site

L’accueil utilise trois étiquettes interactives inspirées du projet Banque Outils IA. Le catalogue affiche d’abord les trois familles, puis une seule collection à la fois. Chaque offre possède une fiche courte, avec un lien distinct vers sa page détaillée. Les démonstrations gratuites sont regroupées sur l’accueil dans la section `#ressources`.

- `index.html` : accueil et guide de choix.
- `catalogue.html` : toutes les offres.
- `contact.html` : contact provisoire uniquement pour des retours publics non confidentiels via GitHub Issues.
- `univers/outils/` : banques détaillées, répertoire, fiches et outil gratuit.
- `univers/procedures/` : pack Conciergerie, exemple P01, atelier et animation clé/coffre 3D.
- `univers/formations/` : quatre pages de formation, FAQ, comparateur et ressources gratuites.

## Conseiller IA génératif

Le chatbot issu de Banque Outils IA est intégré à l’accueil, au catalogue et aux pages des trois univers (33 pages HTML). Il est désormais informé sur les 11 offres ; il peut expliquer le bon choix et proposer des liens vers les pages détaillées, après consentement à l’envoi des messages.

Fonction serveurless : `api/chat.js` (Vercel). Modèle exclusif `reflection/beam-free`, avec vérification préalable du tarif à zéro avant chaque génération et sans basculement payant. Si le modèle gratuit n’est pas disponible, le service s’arrête plutôt que d’engager des frais.

**Recette :** intégration, validation et simulations vérifiées ; les réponses réelles depuis le site doivent encore être validées manuellement. Lire [la documentation complète du chatbot](docs/CHATBOT_IA_UNIFIE_2026-11-03.md).

## État commercial

**Ce projet n'est pas une boutique en production.** Aucun paiement, inscription payante, espace client ou livraison automatique de produit n’est actif. Les banques et les formations restent en préparation ; le pack Conciergerie est un pilote. Le contenu privé des cours IAgile n'a pas été publié.

Site statique, sans étape de build, déployé via la connexion GitHub → Vercel. Aucune automatisation récurrente n’a été créée.

Consulter le [rapport d’intégration](docs/INTEGRATION_3_PROJETS_2026-11-03.md) pour le périmètre exact, les vérifications et les étapes restantes.
