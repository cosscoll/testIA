# Refonte UX et identité visuelle — Studio IA v2
Date : 3 novembre 2026 · Dépôt : \`cosscoll/testIA\` · environnement : site test Vercel

## Constat

Le précédent prototype montrait d’emblée 5 étiquettes, 3 familles détaillées, un mini-guide de choix, plusieurs cartes de produits et 6 ressources gratuites. Malgré la richesse du contenu, les 11 offres se concurrençaient visuellement et le visiteur devait lire beaucoup de texte avant de comprendre la différence entre un pack, une banque et une formation.

## Nouvelle règle de navigation

**Une intention principale par écran.**

1. **Accueil** : comprendre en quelques secondes que la plateforme propose trois chemins ; sélectionner un chemin depuis trois étiquettes interactives. Une seule action principale : « Trouver ma solution ».
2. **Produits / niveau 1** : choisir l’une des trois familles : « J’ai besoin d’une méthode prête à adapter », « Je cherche des outils pour faire avancer un projet », « Je veux apprendre à réaliser moi-même ».
3. **Produits / niveau 2** : voir uniquement les produits de la famille choisie, avec un titre, une phrase d’aide et le statut de disponibilité. 1 pack, 6 banques ou 4 formations. Recherche disponible seulement dans la famille choisie quand cela apporte de la valeur.
4. **Fiche produit** : lire l’essentiel : résultat recherché, résumé, 3 points clés, état réel du produit. Lien facultatif vers la présentation détaillée héritée du site source et, si disponible, une démonstration gratuite.
5. **Présentation détaillée** : contenu existant du projet d’origine, conservé et identifié. Navigation supérieure commune pour revenir rapidement à la plateforme.

La navigation principale ne dépasse pas trois entrées : **Accueil / Produits / Contact**. Pas de faux paiement, ni de navigation vers un achat indisponible.

## Nouvelle identité

Direction : **éditoriale, calme, professionnelle, avec un rappel tactile des étiquettes d’origine**.

| Élément | Choix |
|---|---|
| Fond principal | Charbon \`#101113\` |
| Fond de panneau | Gris anthracite \`#1b1d1e\` |
| Texte | Ivoire \`#f3f0e9\` |
| Accents d’interface | Orange grisé \`#e79a72\` |
| Packs procédures | Vert sauge clair \`#d5decf\` |
| Banques d’outils | Abricot pâle \`#edc2a6\` |
| Formations | Lavande feutrée \`#d0c7de\` |
| Titres | Arial/Helvetica, graisses sobres, sans effet futuriste |
| Micro-libellés | Monospace Courier, utilisés avec parcimonie |
| Interactions | Trois étiquettes inclinées légèrement, se redressant au survol ou au focus |

Les couleurs sont des **repères de navigation**, pas une répétition de grands effets décoratifs. Pas d’images stock, de faux avis, de perspectives 3D gratuites ou de répartition arbitraire des produits.

## Mise en œuvre réelle

- \`assets/platform-v2.css\` : charte, responsive 320–1440 px, 3 étiquettes tactiles et clavier, cartes/listes.
- \`assets/platform-v2.js\` : menu mobile, affichage progressif des familles, recherche ciblée, fiche de synthèse.
- \`index.html\` : accueil réduit à trois étiquettes + trois démonstrations gratuites.
- \`catalogue.html\` : choix de famille avant les produits ; URLs explicites \`?type=procedures|outils|formations\`.
- \`produit.html?id=...\` : aperçu unique, sans surcharge.
- \`contact.html\` : même identité, canal public limité clairement expliqué.
- \`assets/import-shell.css\` : navigation visuellement harmonisée sur les anciennes pages détaillées.

**Données produits conservées** : \`assets/data.js\` contient toujours les onze références et leurs liens. Les ressources gratuites ne sont pas supprimées, simplement mises au second plan.

**Chatbot :** fonctionnalités et API conservées sans correction dans cette refonte, conformément à la décision de traiter son dysfonctionnement ultérieurement. L’ancienne présentation « conseiller » n’est plus un CTA principal : l’orientation du visiteur doit fonctionner même si le chatbot est indisponible.

## Points à valider

- Le visiteur identifie les trois familles en moins de dix secondes (test qualitatif réel à organiser).
- Depuis l’accueil, un clic suffit pour voir une famille, deux pour obtenir une fiche.
- Jamais 11 produits affichés simultanément sur une première visite.
- Liens retour et navigation cohérents depuis les contenus historiques.
- Tests complémentaires navigateur : hover, clavier, Android/iOS, largeur 320/390/768/1024/1440 px, absence de défilement horizontal, stabilité des animations et du menu.
- Tests de lecture de vrais visiteurs non menés à ce jour.

La refonte ne touche pas aux trois dépôts d’origine. Aucun paiement, compte client ou automatisation n’a été ajouté.
