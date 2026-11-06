/* Exécution locale volontaire : node scripts/verify-release.cjs
   Aucun cron, aucune CI et aucun appel API. */
'use strict';
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const tests=[
 'tests/security-static.cjs',
 'tests/smoke-static.cjs',
 'tests/offer-finder.cjs',
 'tests/product-depth.cjs',
 'tests/vault-offer.cjs',
 'tests/chat-contract.cjs'
];
for(const file of tests){
 console.log('\n> '+file);
 const proc=spawnSync(process.execPath,[path.join(root,file)],{
  cwd:root,stdio:'inherit',timeout:45000,env:{...process.env,NO_NETWORK:'1'}
 });
 if(proc.error||proc.status!==0){
  console.error('Échec : '+file+(proc.error?' — '+proc.error.message:''));
  process.exitCode=1;
  break;
 }
}
if(!process.exitCode)console.log('\nOK — contrôles locaux terminés. Ceci ne valide ni navigateur réel, ni secrets Git historiques, ni configuration GitHub/Vercel côté compte.');
