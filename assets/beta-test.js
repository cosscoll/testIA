(()=>{
'use strict';
const $=id=>document.getElementById(id);
const form=$('beta-form');
if(!form)return;
const tasks=[...document.querySelectorAll('[data-beta-task]')];
const selects=tasks.map(task=>task.querySelector('[data-beta-result]'));
const status=$('beta-status'),output=$('beta-report');
function result(){
 const rating=[...document.querySelectorAll('input[name="beta-rating"]')].find(x=>x.checked);
 const finished=selects.filter(x=>Boolean(x.value)).length;
 const blocked=selects.filter(x=>x.value==='Bloquée').length;
 const difficult=selects.filter(x=>x.value==='Difficile').length;
 const succeeded=selects.filter(x=>x.value==='Réussie').length;
 const lines=['STUDIO IA — COMPTE RENDU DE BÊTA-TEST',
 'Date du test : '+new Date().toLocaleDateString('fr-FR'),
 'Missions évaluées : '+finished+' / '+tasks.length,
 'Réussies : '+succeeded+' ; avec difficulté : '+difficult+' ; bloquées : '+blocked,'',
 'Appareil : '+($('beta-device').value||'Non précisé'),
 'Navigateur : '+($('beta-browser').value||'Non précisé'),
 'Aisance numérique : '+($('beta-familiarity').value||'Non précisée'),
 'Facilité générale (1–5) : '+(rating?rating.value:'Non indiquée'),
 '','RÉSULTATS PAR MISSION'];
 tasks.forEach((task,i)=>lines.push((i+1)+'. '+task.dataset.betaTask+' : '+(selects[i].value||'Non testée')));
 lines.push('','DIFFICULTÉS DE COMPRÉHENSION',$('beta-confusing').value||'Non renseigné',
 '','BUGS (ACTION, RÉSULTAT ATTENDU, RÉSULTAT OBSERVÉ)',$('beta-bug').value||'Non renseigné',
 '','AMÉLIORATION PRIORITAIRE',$('beta-improve').value||'Non renseigné',
 '','Rapport généré localement. Aucun envoi automatique. Ne communiquez aucune donnée sensible.');
 return lines.join('\n');
}
function update(){
 const n=selects.filter(x=>!!x.value).length;
 $('beta-progress-label').textContent=n+' / '+tasks.length+' missions évaluées';
 $('beta-progress').value=n;
 $('beta-copy').disabled=n===0;$('beta-export').disabled=n===0;
 output.value=result();
}
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('input',update);
form.addEventListener('change',update);
$('beta-copy').addEventListener('click',async()=>{
 if($('beta-copy').disabled)return;
 try{await navigator.clipboard.writeText(result());status.textContent='Compte rendu copié. Transmettez-le par le canal privé convenu.';}
 catch{output.focus();output.select();status.textContent='Texte sélectionné : Ctrl+C ou Cmd+C.';}
});
$('beta-export').addEventListener('click',()=>{
 if($('beta-export').disabled)return;
 const link=document.createElement('a');
 const uri=URL.createObjectURL(new Blob([result()],{type:'text/plain;charset=utf-8'}));
 link.href=uri;link.download='studio-ia-retour-beta.txt';
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1000);
 status.textContent='Fichier téléchargé localement, non envoyé.';
});
update();
})();