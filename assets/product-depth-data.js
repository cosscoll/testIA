/* Studio IA — apercus pedagogiques publics, pas les produits payants. */
window.STUDIO_PRODUCT_DEPTH = {
  "conciergerie": {
    "focus": "Coordonner une rotation sans confondre demande, exécution et validation.",
    "before": "Plusieurs prestataires reçoivent des consignes distinctes. Le logement peut sembler prêt alors que le contrôle final manque.",
    "after": "Une mission identifiée, acceptée, contrôlée puis transmise avec un statut vérifiable.",
    "status": "Pack pilote : 15 procédures existantes en révision métier et 7 registres CSV annoncés. Cet atelier est un exemple public, distinct du pack à vendre.",
    "phases": [
      {
        "name": "01 / Préparer la mission",
        "what": "Relever les horaires de départ et d’arrivée, les consignes propres au logement et le temps disponible.",
        "proof": "Fiche logement et contrainte horaire revues"
      },
      {
        "name": "02 / Confirmer l'intervention",
        "what": "Proposer la mission, recueillir un accord explicite et désigner qui fera la vérification.",
        "proof": "Intervenant et contrôleur nommés"
      },
      {
        "name": "03 / Contrôler sur place",
        "what": "Séparer la déclaration de fin de ménage du contrôle objectif du logement, du linge et des stocks.",
        "proof": "Écarts consignés et décision de validation"
      },
      {
        "name": "04 / Gérer l'exception",
        "what": "Si l’accès, le délai ou l’état des lieux bloque l’arrivée, escalader auprès du responsable habilité.",
        "proof": "Incident, décision et heure tracés"
      },
      {
        "name": "05 / Transmettre",
        "what": "Indiquer qui prend la suite, les tâches ouvertes et la prochaine échéance.",
        "proof": "Passation compréhensible sans appel supplémentaire"
      }
    ],
    "sample": {
      "title": "Fiche de rotation — exemple de préparation",
      "context": "Un départ est prévu le matin et l’arrivée suivante l’après-midi. Une intervention ménage doit être acceptée, puis contrôlée avant l’arrivée.",
      "fields": [
        {
          "label": "Référence de logement fictive",
          "hint": "Ex. LOGT-A (pas de code d’accès réel)"
        },
        {
          "label": "Heure de départ et heure d’arrivée",
          "hint": "Ex. départ 11 h / arrivée 16 h"
        },
        {
          "label": "Intervention et intervenant prévu",
          "hint": "Ex. ménage — intervenant A, confirmation à obtenir"
        },
        {
          "label": "Personne chargée du contrôle final",
          "hint": "Ex. coordinateur B"
        },
        {
          "label": "Point à vérifier ou anomalie anticipée",
          "hint": "Ex. linge à remplacer, contrôle des consommables"
        }
      ],
      "end": "Ne marquez jamais une intervention comme « confirmée » avant l’accord de l’intervenant. Le contrôle final est une étape distincte."
    },
    "criteria": [
      "La mission a un responsable et une confirmation datée.",
      "La personne qui contrôle n’est pas confondue avec la personne qui exécute.",
      "Une anomalie comporte une décision et une personne chargée de la suite.",
      "La passation contient un statut compréhensible sans échange oral."
    ],
    "inventory": {
      "procedures": [
        "P01 · Planifier une rotation entre deux séjours",
        "P02 · Surveiller les changements de réservations",
        "P03 · Confirmer une mission à un intervenant",
        "P04 · Préparer la fiche opérationnelle d’un logement",
        "P05 · Vérifier qu’un logement est prêt",
        "P06 · Suivre le linge après chaque départ",
        "P07 · Contrôler et réapprovisionner les consommables",
        "P08 · Traiter un incident avant l’arrivée",
        "P09 · Gérer un objet oublié",
        "P10 · Traiter une difficulté d’accès au logement",
        "P11 · Passer la main entre deux coordinateurs",
        "P12 · Traiter une réclamation de propriétaire",
        "P13 · Accueillir un nouvel intervenant",
        "P14 · Planifier une intervention de maintenance",
        "P15 · Faire le bilan mensuel des rotations"
      ],
      "registers": [
        "R01 · Fiches logements",
        "R02 · Suivi des rotations",
        "R03 · Journal des anomalies",
        "R04 · Suivi des stocks",
        "R05 · Passation d’équipe",
        "R06 · Objets trouvés",
        "R07 · Journal des versions"
      ]
    }
  },
  "redaction": {
    "focus": "Préparer un message professionnel utile plutôt qu'une suite de textes génériques.",
    "before": "Une publication ou un email manque de cible, d’argument vérifiable et d’appel à l’action.",
    "after": "Un brief éditorial exploitable, avec audience, preuve, ton et grille de relecture.",
    "status": "Banque en préparation : guide de cadrage, exemples de messages et grille de contrôle envisagés ; le kit payant n’est pas disponible.",
    "phases": [
      {
        "name": "01 / Cibler",
        "what": "Décrire le destinataire, son besoin et le canal de diffusion.",
        "proof": "Une cible et une intention par message"
      },
      {
        "name": "02 / Structurer",
        "what": "Énoncer une idée centrale, deux éléments factuels et une action attendue.",
        "proof": "Plan d’email ou de publication"
      },
      {
        "name": "03 / Adapter",
        "what": "Prévoir une variante courte, une variante détaillée et un ton cohérent.",
        "proof": "Deux angles sans contradictions"
      },
      {
        "name": "04 / Contrôler",
        "what": "Relire les promesses, les chiffres, la confidentialité et les informations pratiques.",
        "proof": "Checklist de validation éditoriale"
      }
    ],
    "sample": {
      "title": "Brief de communication à compléter",
      "context": "Un indépendant présente un nouveau service sans faire de promesse de résultat invérifiable.",
      "fields": [
        {
          "label": "Public visé",
          "hint": "Ex. commerçants de quartier"
        },
        {
          "label": "Objectif du message",
          "hint": "Ex. obtenir un échange de 15 minutes"
        },
        {
          "label": "Fait ou bénéfice vérifiable",
          "hint": "Ex. audit des pages existantes, avec un compte rendu écrit"
        },
        {
          "label": "Ton et canal de diffusion",
          "hint": "Ex. accessible, professionnel, email"
        },
        {
          "label": "Action attendue",
          "hint": "Ex. proposer un créneau d’échange"
        }
      ],
      "end": "Vérifier les faits et demander une validation humaine avant la diffusion. Ne jamais insérer de données client sensibles dans un outil tiers."
    },
    "criteria": [
      "Le message parle à un public identifié.",
      "Une seule action claire est demandée.",
      "Les promesses peuvent être justifiées.",
      "Les données confidentielles ne sont pas utilisées dans un exemple public."
    ]
  },
  "visuels": {
    "focus": "Transformer une demande vague en brief de création visuelle contrôlable.",
    "before": "Une affiche paraît agréable mais le lieu, l’heure ou l’appel à l’action restent illisibles.",
    "after": "Un brief comprenant hiérarchie, contraintes de format, références légitimes et contrôle des droits.",
    "status": "Banque en préparation : méthode de brief, variations de composition et checklist de lisibilité/droits envisagées.",
    "phases": [
      {
        "name": "01 / Définir la cible",
        "what": "Fixer l’objectif, le public et les informations obligatoires.",
        "proof": "Un message principal non ambigu"
      },
      {
        "name": "02 / Composer",
        "what": "Hiérarchiser titre, visuel, détails utiles et appel à l’action.",
        "proof": "Une composition lisible à petite taille"
      },
      {
        "name": "03 / Comparer",
        "what": "Comparer deux pistes en gardant le même objectif.",
        "proof": "Critère de choix explicite"
      },
      {
        "name": "04 / Vérifier",
        "what": "Contrôler contraste, formats, sources des images et droits.",
        "proof": "Visuel relu avant publication"
      }
    ],
    "sample": {
      "title": "Brief d'affiche numérique",
      "context": "Créer un support pour annoncer un atelier fictif, pensé d’abord pour la lecture sur téléphone.",
      "fields": [
        {
          "label": "Support et dimensions cibles",
          "hint": "Ex. publication verticale pour réseau social"
        },
        {
          "label": "Public concerné",
          "hint": "Ex. débutants qui découvrent les outils numériques"
        },
        {
          "label": "Message à lire en premier",
          "hint": "Ex. Atelier découverte — inscriptions ouvertes"
        },
        {
          "label": "Informations obligatoires",
          "hint": "Ex. date, lieu, moyen de contact vérifiés"
        },
        {
          "label": "Images, couleurs et droits",
          "hint": "Ex. utiliser une photo créée en interne ou correctement licenciée"
        }
      ],
      "end": "Un rendu séduisant ne suffit pas : relisez toutes les informations et assurez-vous que les visuels sont utilisables légalement."
    },
    "criteria": [
      "Le titre reste lisible sur un téléphone.",
      "Les dates et coordonnées ont été vérifiées.",
      "L’image possède une origine et des droits documentés.",
      "L’appel à l’action est visible et compréhensible."
    ]
  },
  "web": {
    "focus": "Construire d’abord un parcours compréhensible, puis ajouter les effets et la 3D.",
    "before": "La page est visuellement travaillée mais le visiteur ne comprend ni l’offre ni l’étape suivante.",
    "after": "Une architecture courte, un CTA clair et un plan de vérification mobile avant production.",
    "status": "Banque en préparation : trame de cahier des charges, exemples de structures et checklist de recette envisagés.",
    "phases": [
      {
        "name": "01 / Définir la conversion",
        "what": "Choisir l’action principale et la preuve nécessaire pour décider.",
        "proof": "Un objectif mesurable"
      },
      {
        "name": "02 / Ordonnancer",
        "what": "Présenter problème, solution, preuve, conditions puis action.",
        "proof": "Structure de page priorisée"
      },
      {
        "name": "03 / Prototyper",
        "what": "Tester d’abord sans animations lourdes, puis ajouter les interactions utiles.",
        "proof": "Prototype accessible au clavier"
      },
      {
        "name": "04 / Recetter",
        "what": "Contrôler 360–390 px, tablette, ordinateur, clavier, formulaires et liens.",
        "proof": "Liste de corrections avant mise en ligne"
      }
    ],
    "sample": {
      "title": "Mini-cahier des charges d'une page",
      "context": "Une petite entreprise souhaite présenter son activité avec une page simple et prendre contact.",
      "fields": [
        {
          "label": "Public et problème principal",
          "hint": "Ex. particuliers qui cherchent un artisan disponible"
        },
        {
          "label": "Action principale attendue",
          "hint": "Ex. demander un rappel"
        },
        {
          "label": "Sections indispensables",
          "hint": "Ex. offre, zone d’intervention, réalisations, FAQ, contact"
        },
        {
          "label": "Contraintes mobile et accessibilité",
          "hint": "Ex. texte lisible, CTA visible, navigation clavier"
        },
        {
          "label": "Comment valider le résultat",
          "hint": "Ex. un utilisateur comprend l’offre et trouve le contact sans aide"
        }
      ],
      "end": "Testez la clarté sur un téléphone avant d’ajouter des animations. Les visiteurs doivent pouvoir agir même si WebGL ne fonctionne pas."
    },
    "criteria": [
      "Le visiteur comprend à qui s’adresse la page.",
      "Un CTA principal est identifiable.",
      "Les parcours fonctionnent au clavier et sur petit écran.",
      "Les informations légales et contacts sont vérifiés."
    ]
  },
  "video": {
    "focus": "Créer une séquence courte, montable et compréhensible sans le son.",
    "before": "La vidéo possède de beaux plans mais aucun message central ni rythme clair.",
    "after": "Un storyboard chronologique, une prise de parole courte et une liste de contrôles.",
    "status": "Banque en préparation : canevas storyboard, exemples de narration et checklist audio/sous-titrage envisagés.",
    "phases": [
      {
        "name": "01 / Choisir le message",
        "what": "Une promesse factuelle pour une audience, sur un canal identifié.",
        "proof": "Une phrase centrale vérifiable"
      },
      {
        "name": "02 / Découper",
        "what": "Préparer accroche, illustration, démonstration et conclusion.",
        "proof": "Séquences et plans ordonnés"
      },
      {
        "name": "03 / Produire",
        "what": "Prévoir texte à l’écran, voix, plans et ambiances cohérents.",
        "proof": "Storyboard utilisable au tournage"
      },
      {
        "name": "04 / Vérifier",
        "what": "Contrôler niveau sonore, sous-titres, droits à l’image et licences.",
        "proof": "Version exportée et contrôlée"
      }
    ],
    "sample": {
      "title": "Storyboard d'une vidéo de présentation",
      "context": "Une démonstration fictive de service d’une petite entreprise destinée à une publication courte.",
      "fields": [
        {
          "label": "Audience et canal",
          "hint": "Ex. prospects locaux, publication verticale"
        },
        {
          "label": "Message principal vérifiable",
          "hint": "Ex. une démonstration de notre méthode de prise en charge"
        },
        {
          "label": "Plan d'ouverture (0 à 5 s)",
          "hint": "Ex. problème quotidien filmé en situation"
        },
        {
          "label": "Plan de démonstration (5 à 20 s)",
          "hint": "Ex. étapes concrètes du service"
        },
        {
          "label": "Conclusion et droits des médias",
          "hint": "Ex. invitation à contacter, musiques libres d’usage documentées"
        }
      ],
      "end": "Préparez les sous-titres et vérifiez les autorisations des personnes, voix, musiques et images avant diffusion."
    },
    "criteria": [
      "La vidéo peut être comprise sans audio.",
      "Le message n’exagère pas un résultat.",
      "Les droits des médias et des personnes sont vérifiés.",
      "L’export est testé sur le canal cible."
    ]
  },
  "automatisation": {
    "focus": "Formaliser un flux pilotable avant de connecter de vrais comptes ou APIs.",
    "before": "Une automatisation copie des données sans contrôle et peut créer des doublons en cas de nouvel essai.",
    "after": "Un scénario déclencheur → préparation → validation → action → journal, avec gestion des reprises.",
    "status": "Banque en préparation : guide de sélection, scénario commenté et checklist de sécurité envisagés.",
    "phases": [
      {
        "name": "01 / Sélectionner",
        "what": "Choisir une tâche fréquente, répétable et à faible risque.",
        "proof": "Déclencheur et résultat attendus définis"
      },
      {
        "name": "02 / Cartographier",
        "what": "Lister champs, source, destination et permissions minimales.",
        "proof": "Schéma simple des données échangées"
      },
      {
        "name": "03 / Sécuriser",
        "what": "Prévoir déduplication, validation humaine et journal des erreurs.",
        "proof": "Idempotence et conditions d’arrêt documentées"
      },
      {
        "name": "04 / Tester",
        "what": "Simuler succès, champ absent, doublon et panne avant une action réelle.",
        "proof": "Scénarios de recette vérifiables"
      }
    ],
    "sample": {
      "title": "Fiche de workflow à risque maîtrisé",
      "context": "Un message entrant doit préparer une réponse, mais jamais l’envoyer sans contrôle.",
      "fields": [
        {
          "label": "Déclencheur exact",
          "hint": "Ex. nouveau formulaire de demande reçu"
        },
        {
          "label": "Données nécessaires (sans secrets)",
          "hint": "Ex. objet de la demande et service demandé"
        },
        {
          "label": "Action de préparation",
          "hint": "Ex. créer un brouillon, sans l’envoyer"
        },
        {
          "label": "Point de validation humaine",
          "hint": "Ex. le responsable vérifie le contenu"
        },
        {
          "label": "Doublon, erreur et action de reprise",
          "hint": "Ex. ID unique de demande ; ne pas recréer après un délai API"
        }
      ],
      "end": "Aucune connexion ni action externe n’est effectuée par cet atelier. N’utilisez pas de véritables clés API ou données personnelles."
    },
    "criteria": [
      "La source et la destination sont identifiées.",
      "Le flux traite le même événement deux fois sans produire un doublon.",
      "Une étape sensible nécessite une validation.",
      "Un échec laisse une trace et une procédure de reprise."
    ]
  },
  "analyse": {
    "focus": "Comparer des options sans confondre une source, une hypothèse et une décision.",
    "before": "Une recommandation est fondée sur des résultats non datés et des critères implicites.",
    "after": "Une grille de décision qui cite les sources, les dates, les limites et le niveau de confiance.",
    "status": "Banque en préparation : méthode de recherche, grille comparative et checklist sources/incertitudes envisagées.",
    "phases": [
      {
        "name": "01 / Poser la question",
        "what": "Définir la décision à prendre et les informations réellement nécessaires.",
        "proof": "Question précise et critères sélectionnés"
      },
      {
        "name": "02 / Vérifier les sources",
        "what": "Chercher origine, date, intérêt commercial et contradiction.",
        "proof": "Tableau des sources consultées"
      },
      {
        "name": "03 / Comparer",
        "what": "Appliquer les mêmes critères à chaque option.",
        "proof": "Comparaison lisible et traçable"
      },
      {
        "name": "04 / Décider sous conditions",
        "what": "Séparer fait établi, interprétation et point à vérifier.",
        "proof": "Synthèse conditionnelle, non catégorique"
      }
    ],
    "sample": {
      "title": "Grille de préparation d'une comparaison",
      "context": "Une petite équipe hésite entre deux outils pour organiser les dossiers d’un projet.",
      "fields": [
        {
          "label": "Question de décision",
          "hint": "Ex. quelle solution est adaptée à une équipe de trois personnes ?"
        },
        {
          "label": "Options ou hypothèses à comparer",
          "hint": "Ex. A : solution actuelle / B : nouvel outil"
        },
        {
          "label": "Critères communs",
          "hint": "Ex. coût total, accessibilité, export, prise en main"
        },
        {
          "label": "Sources datées à consulter",
          "hint": "Ex. documentation officielle et conditions tarifaires du jour"
        },
        {
          "label": "Incertitudes ou biais possibles",
          "hint": "Ex. essai gratuit incomplet, déploiement non testé"
        }
      ],
      "end": "Une synthèse sans sources vérifiables ne doit pas être utilisée comme preuve. Les prix et fonctionnalités doivent être recontrôlés."
    },
    "criteria": [
      "Chaque donnée importante possède une source datée.",
      "Les mêmes critères s’appliquent aux options.",
      "Les limites et informations inconnues sont explicites.",
      "La décision reste révisable si les données changent."
    ]
  },
  "formation-3d": {
    "focus": "Passer d’un brief à une expérience 3D fluide, navigable et accessible.",
    "before": "Une scène 3D impressionne en démonstration, mais tremble ou bloque sur téléphone.",
    "after": "Un prototype mesurable avec alternative non-WebGL, dossier de production et recette.",
    "status": "Formation non ouverte : progression indicative extraite de l’objectif pédagogique public. Le parcours complet est annoncé en 15 modules et un approfondissement ; sa livraison reste à finaliser.",
    "phases": [
      {
        "name": "01 / Fondations",
        "what": "Préparer structure HTML/CSS, caméra, géométrie et un objectif de navigation.",
        "proof": "Brief et wireframe lisibles sans animation"
      },
      {
        "name": "02 / Scène contrôlée",
        "what": "Créer une scène compacte avec lumières, matériaux et placement des objets.",
        "proof": "Premier rendu stable avec alternative statique"
      },
      {
        "name": "03 / Mouvement",
        "what": "Lier la progression à une interaction explicite, sans sauts ni retournements.",
        "proof": "Courbes de caméra et chronologie testées"
      },
      {
        "name": "04 / Interactions",
        "what": "Prévoir clic, clavier, états actifs et liens vers le contenu.",
        "proof": "Parcours complet sans souris"
      },
      {
        "name": "05 / Optimisation",
        "what": "Mesurer poids, vitesse, comportement mobile et réduction des mouvements.",
        "proof": "Recette de performance et accessibilité documentée"
      }
    ],
    "sample": {
      "title": "Brief de prototype 3D",
      "context": "Une agence souhaite présenter trois projets au travers d’une seule scène 3D, sans perdre les visiteurs.",
      "fields": [
        {
          "label": "Objectif et public",
          "hint": "Ex. permettre aux visiteurs de comparer trois projets"
        },
        {
          "label": "Objet 3D et interaction principale",
          "hint": "Ex. prisme qui présente un projet sur chaque face"
        },
        {
          "label": "Navigation de repli sans WebGL",
          "hint": "Ex. liste HTML accessible aux liens identiques"
        },
        {
          "label": "Contraintes techniques",
          "hint": "Ex. fluide sur téléphone, textures légères"
        },
        {
          "label": "Tests de réussite",
          "hint": "Ex. trois liens fonctionnent clavier/touch, scène stable au redimensionnement"
        }
      ],
      "end": "Une belle scène ne suffit pas : la page doit rester compréhensible quand JavaScript, WebGL ou les animations sont indisponibles."
    },
    "criteria": [
      "Le parcours est utilisable sans WebGL.",
      "La caméra ne tremble pas ni ne se retourne involontairement.",
      "Les cibles sont accessibles au clavier et au toucher.",
      "Le prototype est testé sur plusieurs tailles d’écran."
    ]
  },
  "formation-agents": {
    "focus": "Concevoir un agent spécialisé qui sait répondre, citer ses sources et demander une autorisation.",
    "before": "Un assistant généraliste invente une procédure et veut modifier des données client.",
    "after": "Une fiche d’agent avec permissions minimales, outils, limites et jeu de tests.",
    "status": "Formation non ouverte : aperçu de la progression publique ; cursus annoncé en 12 modules avec deux voies, sans code ou technique.",
    "phases": [
      {
        "name": "01 / Cadrer la mission",
        "what": "Décrire la tâche, le public, les entrées et la sortie attendue.",
        "proof": "Fiche mission et limites explicites"
      },
      {
        "name": "02 / Construire le contexte",
        "what": "Définir sources fiables, versionnage et documents autorisés.",
        "proof": "Catalogue de connaissances révisable"
      },
      {
        "name": "03 / Fixer les permissions",
        "what": "Séparer lecture, proposition et action réelle ; exiger des validations.",
        "proof": "Matrice actions autorisées/interdites"
      },
      {
        "name": "04 / Tester",
        "what": "Préparer cas normaux, ambiguïtés, prompt injection et absence de source.",
        "proof": "Jeu de tests avec réponses attendues"
      },
      {
        "name": "05 / Déployer prudemment",
        "what": "Mettre en place suivi, corrections et retrait d’une source obsolète.",
        "proof": "Plan de revue humaine et maintenance"
      }
    ],
    "sample": {
      "title": "Cahier d'identité d'un agent spécialisé",
      "context": "Un assistant répond aux questions sur une offre, mais ne peut ni modifier le prix ni prendre une commande.",
      "fields": [
        {
          "label": "Mission précise",
          "hint": "Ex. expliquer le contenu validé d’une formation"
        },
        {
          "label": "Sources autorisées et date de mise à jour",
          "hint": "Ex. FAQ publique relue et fiche officielle datée"
        },
        {
          "label": "Actions explicitement interdites",
          "hint": "Ex. modifier un prix, promettre une place, envoyer un email"
        },
        {
          "label": "Validation ou escalade humaine",
          "hint": "Ex. transfert à un conseiller en cas de demande contractuelle"
        },
        {
          "label": "Test d'erreur et de refus",
          "hint": "Ex. demander une information absente de la FAQ : ne pas inventer"
        }
      ],
      "end": "Ne connectez jamais un compte ou une base avec des droits d’écriture sans contrôle humain et évaluation des risques."
    },
    "criteria": [
      "L’agent sait reconnaître une information absente.",
      "Une action sensible demande une confirmation humaine.",
      "Les contenus externes ne peuvent pas élargir ses permissions.",
      "Les tests comprennent demandes normales, ambiguës et malveillantes."
    ]
  },
  "formation-auto": {
    "focus": "Construire un workflow fiable et savoir le réparer sans effet secondaire.",
    "before": "Une opération est rejouée après un délai réseau et deux notifications sont envoyées.",
    "after": "Un scénario automatisé avec clé de déduplication, journal, reprise et contrôle des résultats.",
    "status": "Formation non ouverte : jalons issus de l’objectif public ; cursus de 11 modules annoncé, détails pédagogiques encore à valider.",
    "phases": [
      {
        "name": "01 / Mesurer le manuel",
        "what": "Chronométrer et documenter la tâche de départ.",
        "proof": "Temps de référence et carte du processus"
      },
      {
        "name": "02 / Modéliser les données",
        "what": "Définir schéma minimal, erreurs d’entrée et destinataire.",
        "proof": "Contrat d’entrée/sortie"
      },
      {
        "name": "03 / Implémenter sans effet de bord",
        "what": "Ajouter clé unique et confirmation avant toute action externe.",
        "proof": "Premier flux de test sûr"
      },
      {
        "name": "04 / Simuler les incidents",
        "what": "Tester expiration, duplication, droits insuffisants et reprise.",
        "proof": "Journal des erreurs et plan de reprise"
      },
      {
        "name": "05 / Valider le gain réel",
        "what": "Mesurer durée corrigée, qualité et maintenance.",
        "proof": "Comparaison avant/après documentée"
      }
    ],
    "sample": {
      "title": "Plan de reprise d'une automatisation",
      "context": "Un formulaire est soumis deux fois et un serveur répond trop tard pour savoir si l’action a abouti.",
      "fields": [
        {
          "label": "Tâche automatisée et fréquence",
          "hint": "Ex. préparer un résumé après chaque demande"
        },
        {
          "label": "Identifiant unique de l'événement",
          "hint": "Ex. ID de formulaire fourni par le service source"
        },
        {
          "label": "Données et règle de validation",
          "hint": "Ex. vérifier les champs obligatoires avant de créer un brouillon"
        },
        {
          "label": "Comportement si l’action a déjà réussi",
          "hint": "Ex. retrouver l’enregistrement existant plutôt que le dupliquer"
        },
        {
          "label": "Plan de reprise et responsable",
          "hint": "Ex. alerte, vérification de l’état, relance manuelle seulement si nécessaire"
        }
      ],
      "end": "Tester avec des données fictives. Les clés de déduplication doivent être conçues avant d’activer des écritures réelles."
    },
    "criteria": [
      "Un double déclenchement ne répète pas l’action.",
      "Chaque échec est observable et explicable.",
      "La reprise ne détruit ni ne modifie des données par inadvertance.",
      "Le temps gagné tient compte de la vérification et de la maintenance."
    ]
  },
  "formation-quotidien": {
    "focus": "Installer une routine IA utile et vérifiable, plutôt qu'accumuler des prompts.",
    "before": "Les notes et les échanges sont transformés en tâches sans distinguer décisions et hypothèses.",
    "after": "Un rituel hebdomadaire avec synthèse, responsables, preuves, vérification et mesure du temps net.",
    "status": "Formation non ouverte : exemple de progression lié au cursus annoncé de 9 modules, sans promesse de productivité chiffrée.",
    "phases": [
      {
        "name": "01 / Choisir une routine",
        "what": "Repérer une tâche répétitive mais pas trop sensible.",
        "proof": "Une activité testable chaque semaine"
      },
      {
        "name": "02 / Structurer l'entrée",
        "what": "Trier notes, sources, données à exclure et éléments incertains.",
        "proof": "Consigne claire pour un assistant"
      },
      {
        "name": "03 / Contrôler les sorties",
        "what": "Séparer décisions prises, idées, tâches et questions ouvertes.",
        "proof": "Compte rendu qui ne fabrique pas de décisions"
      },
      {
        "name": "04 / Réutiliser",
        "what": "Documenter un modèle adaptable et un moment de relecture.",
        "proof": "Routine prête à réexécuter"
      },
      {
        "name": "05 / Mesurer",
        "what": "Comparer temps total avec et sans IA, corrections incluses.",
        "proof": "Bilan net sans chiffre inventé"
      }
    ],
    "sample": {
      "title": "Fiche d'une routine hebdomadaire",
      "context": "Une personne souhaite transformer des notes de réunion fictives en actions, sans créer de fausses échéances.",
      "fields": [
        {
          "label": "Tâche à simplifier",
          "hint": "Ex. préparer une liste d’actions après la réunion du lundi"
        },
        {
          "label": "Informations autorisées",
          "hint": "Ex. notes anonymisées sans noms de clients"
        },
        {
          "label": "Livrable attendu",
          "hint": "Ex. décisions confirmées / propositions / questions ouvertes"
        },
        {
          "label": "Point de relecture humaine",
          "hint": "Ex. vérifier les responsabilités et les dates avant diffusion"
        },
        {
          "label": "Mesure du temps total",
          "hint": "Ex. noter préparation + génération + corrections, puis comparer au manuel"
        }
      ],
      "end": "Mesurez le temps réellement gagné en incluant toutes les corrections. L’IA ne décide pas à votre place."
    },
    "criteria": [
      "Les faits confirmés sont distincts des suggestions.",
      "La routine respecte la confidentialité.",
      "Le responsable relit avant tout envoi externe.",
      "Le gain est mesuré, pas supposé."
    ]
  }
};
