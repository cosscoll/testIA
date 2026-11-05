# Studio IA — Module commercial émergent du coffre (5 novembre 2026)

## Expérience validée dans testIA

Sur les onze pages `produit.html?id=...`, la clé suit toujours son trajet original puis tourne dans la serrure du coffre Three.js de Pack Procédures Pro. **Le fichier 3D original n'est pas modifié.**

La dernière séquence de scroll est réorganisée :
1. La clé arrive au coffre et la serrure tourne.
2. Le couvercle s'ouvre complètement (vers les trois quarts de la zone finale).
3. Une carte produit en HTML et CSS 3D, placée à l'emplacement visuel du coffre, s'élève, s'agrandit et devient lisible.
4. À l'ouverture complète, la présentation de la clé s'efface et les actions de conversion sont accessibles au clavier, à la souris et au toucher.
5. Si le visiteur remonte, le module redevient invisible et non interactif.

Le module est synchronisé avec `window.rotationScene.getVaultState().open` lorsqu'une véritable scène WebGL fonctionne. Il reste possible de l'utiliser avec le fallback statique ou la préférence « réduire les animations ». Un plafond d'itérations prévient une boucle de rendu permanente si la scène s'immobilise.

Le module affiche **les données réelles du produit demandé** : famille, nom, bénéfice principal, trois éléments inclus, format et disponibilité.

## Préparation des ventes : pas de faux paiement

Les onze produits sont actuellement en cours de préparation ou de validation. **Aucun prix confirmé ni aucun lien de paiement validé n'est présent dans le catalogue de ce site test.**

Tant qu'une offre n'est pas commercialisable, le module affiche :
- un bouton principal « Découvrir l'offre complète » vers sa page détaillée originale,
- un bouton « Préparer une demande de disponibilité » qui mène à Contact avec l'offre préremplie,
- une mention explicite indiquant qu'aucun achat ou abonnement n'est actif.

Sur Contact, le brouillon peut être copié **localement** et ne part pas automatiquement vers un serveur. L'alternative GitHub est un canal public, clairement indiqué comme tel. Cette solution ne doit pas être présentée comme une précommande ou une liste d'attente enregistrée.

### Activer un lien d'achat réel plus tard

Lorsque le produit, son prix, ses conditions de vente et son paiement ont été validés, renseigner les propriétés suivantes sur **l'objet produit concerné** dans `assets/data.js` :

- `sellable: true` (validation explicite du lancement commercial),
- `price: '49 €'` (exemple de syntaxe, **pas un tarif décidé**),
- `checkoutUrl: 'https://buy.stripe.com/LIEN_VERIFIE'` (exemple de structure, **pas une URL de paiement valide**).

Le moteur n'affichera « Acheter le pack », « Acheter la banque » ou « M'inscrire à la formation » **que si les trois champs sont présents** et que l'adresse de paiement utilise HTTPS avec le domaine `buy.stripe.com` ou `checkout.stripe.com`. Les autres domaines et liens incomplets sont rejetés. L'acheteur sera redirigé vers le paiement Stripe externe, sans traitement direct de carte bancaire par testIA.

Avant toute mise en vente, vérifier le montant et le produit réellement associés au paiement Stripe, les taxes applicables, le mode de livraison, les CGV/mentions légales, la politique de confidentialité, les droits d'accès après achat et le comportement des succès/échecs de paiement. **L'activation de ces trois champs ne suffit pas à mettre en place une livraison numérique automatique.**

## Fichiers concernés

- `produit.html` : structure du module à l'intérieur de la zone sticky du coffre.
- `assets/vault-offer.css` : habillage de la carte dans la charte orange/crème, échelle, profondeur, responsive, accessibilité.
- `assets/product-cinema.js` : personnalisation des onze offres et synchronisation entre ouverture 3D et émergence de la carte.
- `assets/contact-draft.js` : préremplissage à partir de l'ID d'un produit valide.
- `tests/vault-offer.cjs` : simulations reproductibles des onze scénarios, ouverture/fermeture, déclenchement et contrôle de l'URL d'achat.

## Contrôles effectués

- Les 11 fiches ont été rendues dans un DOM simulé : titres, familles, statuts, trois bénéfices et destinations corrects.
- Le module est caché avant l'ouverture, apparaît lorsque le coffre est ouvert, devient non interactif si la serrure se ferme, puis disparaît lors d'un retour en arrière.
- Les demandes d'une offre reconnue sont préremplies sur Contact et peuvent être copiées sans envoi.
- Les fichiers de la scène Three.js n'ont pas été modifiés.
- Pas de paiement actif, pas de prix inventé, pas de transaction exécutée.

## Recette visuelle encore nécessaire

L'effet est un **module HTML/CSS perspective superposé à la scène WebGL**, pas un nouvel objet 3D placé physiquement dans le coffre. Il faut valider dans un navigateur réel le point d'origine visuel de l'émergence, notamment en 360, 390, 768 et 1440 px, ainsi que l'absence de chevauchement avec le couvercle et les autres textes. Le déploiement Vercel et l'absence d'erreurs serveur ne suffisent pas à garantir la qualité de cet alignement.

## Amélioration possible à la mise en vente

Une fois les offres prêtes, ajouter les vrais prix et paiements Stripe testés, la confirmation d'achat, la livraison numérique des packs, la gestion des accès formations et un parcours de support privé. Avant cette étape, éviter tout bouton « Acheter » non fonctionnel.
