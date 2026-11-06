/* Prototype testIA — catalogue unifie. Le statut 'preparation' n'est pas une offre commercialisee. */
window.TESTIA_PRODUCTS = [
  {
    id:'conciergerie', type:'procedures', number:'P.01', title:'Conciergeries & locations courte durée',
    short:'Structurer les rotations, les contrôles et les passations entre intervenants.',
    summary:'Un ensemble de procédures et de registres pour répartir le travail, suivre les incidents et transmettre les bonnes informations, sans tout reconstruire à chaque séjour.',
    detail:'15 procédures + 7 registres', status:'Pilote — en validation métier', audience:'Conciergeries, gestionnaires de locations et petites équipes terrain',
    features:['15 procédures opérationnelles à personnaliser','7 registres pour organiser le suivi','Rotation, ménage, linge, stocks et signalement d’incidents','Passation et contrôle de fin de prestation'],
    result:'Passer d’informations dispersées à une méthode de travail transmissible.',
    accent:'mint'
  },
  {
    id:'redaction', type:'outils', number:'O.01', title:'Rédaction & communication',
    short:'Préparer des messages, des offres et des contenus plus vite.',
    summary:'Une sélection d’outils et de méthodes IA pour structurer vos idées, préparer des messages professionnels et améliorer vos premiers brouillons.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Indépendants, petites entreprises, communicants',
    features:['Rédiger un email ou une offre claire','Construire des messages réutilisables','Adapter un texte à son public','Tester et améliorer une première version'],
    result:'Produire un brouillon plus rapidement, puis le relire et le personnaliser.', accent:'orange'
  },
  {
    id:'visuels', type:'outils', number:'O.02', title:'Création visuelle',
    short:'Donner forme à des idées et à des supports de communication.',
    summary:'Explorer des outils IA de création et de retouche visuelle, avec une méthode pour passer d’un brief à une proposition graphique.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Créateurs, entrepreneurs et équipes communication',
    features:['Clarifier un brief visuel','Explorer des propositions graphiques','Préparer un support de communication','Sélectionner et améliorer un rendu'],
    result:'Mettre en images une idée et disposer d’une première direction visuelle.', accent:'orange'
  },
  {
    id:'web', type:'outils', number:'O.03', title:'Sites web & prototypes',
    short:'Découvrir les outils pour créer une page et prototyper une idée.',
    summary:'Une banque d’outils pour imaginer, prototyper et améliorer des interfaces web simples, du premier écran à la vérification responsive.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Indépendants et personnes qui portent un projet web',
    features:['Structurer le contenu d’une page','Composer une première interface','Tester une idée sans repartir de zéro','Vérifier les formats ordinateur et mobile'],
    result:'Obtenir une base de prototype à tester et à faire évoluer.', accent:'orange'
  },
  {
    id:'video', type:'outils', number:'O.04', title:'Vidéo & audio',
    short:'Créer, monter et raconter grâce à des outils accessibles.',
    summary:'Repérer les bons outils IA pour préparer une courte vidéo, organiser un montage, une voix off ou des sous-titres.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Créateurs de contenus et communicants',
    features:['Préparer un storyboard simple','Construire une courte séquence','Explorer voix off et sous-titrage','Contrôler la cohérence du résultat'],
    result:'Passer d’une idée à un premier support vidéo ou audio.', accent:'orange'
  },
  {
    id:'automatisation', type:'outils', number:'O.05', title:'Automatisation',
    short:'Relier vos outils et réduire les tâches répétitives.',
    summary:'Identifier les tâches répétitives, concevoir un petit flux de travail et connaître les points à contrôler avant de l’utiliser.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Indépendants et petites équipes',
    features:['Repérer les actions répétitives','Dessiner un flux déclencheur → action','Choisir un outil adapté','Ajouter des vérifications et des exceptions'],
    result:'Créer un premier scénario d’automatisation compréhensible.', accent:'orange'
  },
  {
    id:'analyse', type:'outils', number:'O.06', title:'Recherche & analyse',
    short:'Comparer des informations pour mieux décider.',
    summary:'Des outils et méthodes pour collecter, organiser et comparer des sources, avec une attention portée à la fiabilité des résultats.',
    detail:'Banque d’outils IA', status:'En préparation', audience:'Entrepreneurs et porteurs de projet',
    features:['Structurer une recherche','Comparer différentes sources','Synthétiser des informations','Présenter une analyse lisible'],
    result:'Transformer des informations éparses en pistes de décision.', accent:'orange'
  },
  {
    id:'formation-3d', type:'formations', number:'F.01', title:'Créer des sites web 3D animés',
    short:'Concevoir et produire une expérience web immersive.',
    summary:'Un parcours pédagogique orienté réalisation pour apprendre à imaginer, construire, animer et tester un site immersif en gardant une navigation utilisable.',
    detail:'Formation IAgile', status:'Inscriptions non ouvertes', audience:'Créatifs, profils web et entrepreneurs motivés',
    features:['Bases et préparation d’un brief','Composition d’une scène web 3D','Interactions et animations','Responsive, performance et accessibilité'],
    result:'Viser la réalisation d’un site immersif et de son dossier de production.', accent:'purple'
  },
  {
    id:'formation-agents', type:'formations', number:'F.02', title:'Créer des agents IA personnalisés',
    short:'Concevoir un assistant adapté à un usage précis.',
    summary:'Comprendre comment cadrer un agent IA, définir son rôle, ses ressources et les limites de ce qu’il doit réaliser.',
    detail:'Formation IAgile', status:'Inscriptions non ouvertes', audience:'Professionnels et créateurs de projets IA',
    features:['Définir un besoin réel','Structurer des consignes efficaces','Organiser les informations de référence','Tester les réponses et les garde-fous'],
    result:'Savoir concevoir et évaluer un premier agent ciblé.', accent:'purple'
  },
  {
    id:'formation-auto', type:'formations', number:'F.03', title:'Automatiser une tâche avec l’IA',
    short:'Passer d’une action manuelle à un flux de travail contrôlable.',
    summary:'Identifier un processus simple, en comprendre les étapes et apprendre à concevoir une automatisation avec validation et suivi.',
    detail:'Formation IAgile', status:'Inscriptions non ouvertes', audience:'Indépendants et salariés souhaitant gagner du temps',
    features:['Cartographier une tâche','Choisir déclencheurs et actions','Gérer les erreurs','Mesurer et contrôler les résultats'],
    result:'Savoir préparer un premier scénario d’automatisation.', accent:'purple'
  },
  {
    id:'formation-quotidien', type:'formations', number:'F.04', title:'L’IA dans les processus du quotidien',
    short:'Intégrer des usages simples de l’IA au travail.',
    summary:'Apprendre à utiliser des méthodes IA concrètes pour organiser, rédiger, retrouver et structurer les tâches du quotidien.',
    detail:'Formation IAgile', status:'Inscriptions non ouvertes', audience:'Débutants, professionnels et petites structures',
    features:['Repérer les bons usages de l’IA','Organiser documents et informations','Structurer des demandes','Vérifier et améliorer les résultats'],
    result:'Construire des habitudes de travail plus simples et reproductibles.', accent:'purple'
  }
];
window.TESTIA_TYPES = {
  procedures:{label:'Packs procédures',singular:'Pack procédures',heading:'Des méthodes prêtes à adapter.',description:'Pour agir tout de suite : des documents et processus à personnaliser selon votre métier.'},
  outils:{label:'Banques d’outils IA',singular:'Banque d’outils IA',heading:'Les bons outils pour vos idées.',description:'Pour explorer : des outils, des modes d’emploi et des cas d’usage rangés par objectif.'},
  formations:{label:'Formations IA',singular:'Formation IA',heading:'Apprendre à faire soi-même.',description:'Pour monter en compétences : des parcours progressifs orientés pratique.'}
};


/* Liens vers les pages de contenu originales intégrées à la plateforme.
   Sources publiques uniquement : aucune leçon privée ni offre payante non ouverte. */
window.TESTIA_DEEP = {
  conciergerie: {page:'./univers/procedures/pack-conciergerie.html',pageLabel:'Explorer le pack complet',demo:'./univers/procedures/exemple-procedure.html',demoLabel:'Essayer la procédure P01',secondary:'./univers/procedures/atelier-decisions.html',secondaryLabel:'Tester trois décisions métier'},
  redaction: {page:'./univers/outils/pack-redaction.html',pageLabel:'Explorer la banque Rédaction',demo:'./univers/outils/outils/assistant-messages.html',demoLabel:'Essayer le générateur gratuit'},
  visuels: {page:'./univers/outils/pack-visuel.html',pageLabel:'Explorer la banque Visuels'},
  web: {page:'./univers/outils/pack-sites-web.html',pageLabel:'Explorer la banque Sites web'},
  video: {page:'./univers/outils/pack-video-audio.html',pageLabel:'Explorer la banque Vidéo & audio'},
  automatisation: {page:'./univers/outils/pack-automatisation.html',pageLabel:'Explorer la banque Automatisation',demo:'./univers/outils/outils/atelier-automatisation.html',demoLabel:'Construire et tester un workflow'},
  analyse: {page:'./univers/outils/pack-recherche-analyse.html',pageLabel:'Explorer la banque Recherche & analyse'},
  'formation-3d': {page:'./univers/formations/formations/sites-web-3d.html',pageLabel:'Voir le programme de formation',demo:'./univers/formations/ressources/brief-site-3d.html',demoLabel:'Tester le brief 3D'},
  'formation-agents': {page:'./univers/formations/formations/agents-personnalises.html',pageLabel:'Voir le programme de formation',demo:'./univers/formations/ressources/agent-readiness.html',demoLabel:'Tester mon idée d’agent'},
  'formation-auto': {page:'./univers/formations/formations/automatiser-tache.html',pageLabel:'Voir le programme de formation',demo:'./univers/formations/ressources/incident-lab.html',demoLabel:'Essayer Incident Lab'},
  'formation-quotidien': {page:'./univers/formations/formations/ia-au-quotidien.html',pageLabel:'Voir le programme de formation',demo:'./univers/formations/ressources/diagnostic-10-questions.html',demoLabel:'Faire le diagnostic gratuit'}
};
