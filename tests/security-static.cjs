/* Studio IA — vérifications manuelles de sécurité sur une copie locale.
   Usage : node tests/security-static.cjs
   Ce contrôle n'est ni une analyse de sécurité exhaustive, ni une tâche programmée. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
let checks=0;
function check(ok,label){assert.ok(ok,label);checks++;}
const config=JSON.parse(read('vercel.json'));
check(Array.isArray(config.headers)&&config.headers.length>0,'Aucun en-tête Vercel défini');
const scope=config.headers.find(h=>h.source==='/(.*)');
check(Boolean(scope),'En-têtes non appliqués à toutes les routes');
const h=Object.fromEntries(scope.headers.map(x=>[x.key.toLowerCase(),x.value]));
check(h['x-content-type-options']==='nosniff','Protection MIME manquante');
check(h['x-frame-options']==='SAMEORIGIN','Protection contre le framing manquante');
check(h['referrer-policy']==='strict-origin-when-cross-origin','Referrer-Policy absente');
check(h['permissions-policy'].includes('camera=()'),'Accès caméra inutile autorisé');
check(h['permissions-policy'].includes('microphone=()'),'Accès microphone inutile autorisé');
check(h['permissions-policy'].includes('payment=()'),'Payment Request API inutile autorisée');
check(h['strict-transport-security'].startsWith('max-age='),'En-tête HSTS manquant');
const csp=h['content-security-policy']||'';
check(csp.includes("base-uri 'self'"),'CSP : base-uri absent');
check(csp.includes("object-src 'none'"),'CSP : objet actif non bloqué');
check(csp.includes("frame-ancestors 'self'"),'CSP : frame-ancestors absent');
check(!csp.includes("'unsafe-inline'"),'CSP globale trop permissive');
const ignored=read('.vercelignore').split(/\r?\n/).map(x=>x.trim());
for(const p of ['README.md','docs/','tests/','scripts/','*.zip','*.env','*.env.*']){
 check(ignored.includes(p),'Exclusion de déploiement manquante : '+p);
}
check(!ignored.includes('univers/'),'Les démonstrations publiques ne doivent pas être exclues');
check(!ignored.includes('*.md'),'Les trois guides Markdown publics doivent rester accessibles');
for(const p of ['univers/procedures/reproduction-3d/README.md','univers/outils/demo/forme-3d/GUIDE-PROMPTS.md','univers/outils/demo/nova-3d/PROMPTS.md']){
 check(exists(p),'Guide public supprimé : '+p);
}
check(!exists('.env')&&!exists('.env.local'),'Environnement local présent dans le dépôt');
check(!exists('node_modules'),'Dépendances installées dans le dépôt');
const gitignore=read('.gitignore').split(/\r?\n/).map(x=>x.trim());
for(const pattern of ['.env','.env.*','*.pem','*.key','private/','secrets/','studio_ia_produits_prives_*/']){
 check(gitignore.includes(pattern),'Protection locale Git absente : '+pattern);
}
check(!exists('studio_ia_produits_prives_2026-11-06'),'Livrables commerciaux privés présents dans le dépôt');
// Parcourir les fichiers texte contrôlés par l'équipe. Un match demande une revue humaine,
// ce n'est pas une garantie d'absence de secret dans l'historique Git ou les médias.
const folders=['api','assets','docs'];
const extensions=new Set(['.js','.cjs','.json','.html','.css','.md','.mjs','.yml','.yaml']);
const suspectNames=[/(^|\/)\.env(?:\.|$)/i,/\.(?:pem|p12|pfx|key)$/i,/(^|\/)(?:id_rsa|id_ed25519)(?:\.|$)/i,/(^|\/)(?:credentials|service-account)(?:[._-]|$)/i];
const patterns=[
 {label:'clé privée PEM',re:new RegExp('-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')},
 {label:'clé Stripe non prévue',re:new RegExp('sk_(?:live|test)_[A-Za-z0-9]{12,}')},
 {label:'jeton GitHub de type personnel',re:new RegExp('(?:ghp_|github_pat_)[A-Za-z0-9_]{24,}')},
 {label:'clé AWS intégrée',re:new RegExp('AKIA[0-9A-Z]{16}')},
 {label:'jeton Slack intégré',re:new RegExp('xox[baprs]-[A-Za-z0-9-]{20,}')}
];
function inspectDir(relative){
 if(!exists(relative))return;
 for(const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){
  const p=path.posix.join(relative,entry.name);
  if(entry.isDirectory()){inspectDir(p);continue;}
  if(!entry.isFile())continue;
  check(!suspectNames.some(re=>re.test(p)),'Nom de fichier confidentiel dans Git : '+p);
  if(!extensions.has(path.extname(p))||p==='tests/security-static.cjs')continue;
  const st=fs.statSync(path.join(root,p));
  if(st.size>1024*1024)continue;
  const body=read(p);
  for(const pattern of patterns)check(!pattern.re.test(body),pattern.label+' possible dans '+p);
 }
}
folders.forEach(inspectDir);
check(exists('api/chat.js'),'API du conseiller manquante');
const api=read('api/chat.js');
check(api.includes('freeModelStillFree()'),'La vérification du coût du modèle a disparu');
check(api.includes("if(!isFree)return respond"),'La barrière de coût a disparu');
check(api.includes('validateMessages(body.messages)'),'Validation des messages désactivée');
check(api.includes('corsAllowed(req)'),'Filtrage d’origine absent');
check(api.includes("Cache-Control','no-store"),'Réponse privée mise en cache');
check(!exists('.github/workflows'),'Aucun workflow récurrent ou déclenché automatiquement ne doit être introduit');
const index=read('index.html');
check((index.match(/class="op-card op-card--/g)||[]).length===5,'Les 5 étiquettes interactives ont changé');
check(exists('univers/procedures/assets/apartment-scene.js'),'Scène originale 3D perdue');
console.log('OK — '+checks+' contrôles manuels de configuration, exclusions, signatures et invariants.');
