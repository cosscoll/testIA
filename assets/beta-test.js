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
 const lines=['STUDIO IA - COMPTE RENDU BETA','',
 'Appareil : '+$('beta-device').value,
 'Navigateur : '+$('beta-browser').value,
 'Aisance numerique : '+$('beta-familiarity').value,
 'Facilite generale (1-5) : '+(rating?rating.value:'Non indiquee'),
 '','MISSIONS'];
 tasks.forEach((task,i)=>lines.push((i+1)+'. '+task.dataset.betaTask+' : '+(selects[i].value||'Non testee')));
 lines.push('','DIFFICULTES',$('beta-confusing').value||'Non renseigne',
 '','BUGS',$('beta-bug').value||'Non renseigne',
 '','AMELIORATIONS',$('beta-improve').value||'Non renseigne',
 '','Rapport local. Aucun envoi automatique.');
 return lines.join('\n');
}
function update(){
 const n=selects.filter(x=>!!x.value).length;
 $('beta-progress-label').textContent=n+' / '+tasks.length+' missions evaluees';
 $('beta-progress').value=n;
 $('beta-copy').disabled=n===0;$('beta-export').disabled=n===0;
 output.value=result();
}
form.addEventListener('input',update);
form.addEventListener('change',update);
$('beta-copy').addEventListener('click',async()=>{
 if($('beta-copy').disabled)return;
 try{await navigator.clipboard.writeText(result());status.textContent='Compte rendu copie. Transmettez-le manuellement.';}
 catch{output.focus();output.select();status.textContent='Texte selectionne : Ctrl+C ou Cmd+C.';}
});
$('beta-export').addEventListener('click',()=>{
 if($('beta-export').disabled)return;
 const link=document.createElement('a');
 const uri=URL.createObjectURL(new Blob([result()],{type:'text/plain;charset=utf-8'}));
 link.href=uri;link.download='studio-ia-retour-beta.txt';
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1000);
 status.textContent='Fichier telecharge localement, non envoye.';
});
update();
})();