/* LIV-03 — tests hors réseau des workflows, moteurs et interactions du site.
   À lancer manuellement : node tests/workflow-studio.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=read('univers/outils/assets/workflow-studio.js');
const ui=read('univers/outils/outils/atelier-automatisation.html');
let count=0,downloads=0,urls=0,revoked=0,requests=0;
const check=(value,label)=>{assert.ok(value,label);count++;};
class Element {
 constructor(tag='div',value=''){this.tagName=tag;this.value=value;this.children=[];this.listeners={};this.attributes={};this.dataset={};this.textContent='';this.disabled=false;}
 addEventListener(k,cb){this.listeners[k]=cb;}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this.children=x}
 setAttribute(k,v){this.attributes[k]=String(v)}
 click(){downloads++}
 remove(){}
}
const fields={title:'Trier une demande de devis',owner:'Responsable commercial',trigger:'Nouvelle demande reçue',action:'Préparer un brouillon de réponse',required:'Contact et nature du projet'};
const ids=['workflowStudio','wf-new-step','wf-steps','wf-add-step','wf-plan','wf-health','wf-export-json','wf-export-txt','wf-approve','wf-result','wf-log','wf-case','wf-run','wf-status'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element()]));
for(const [id,value] of Object.entries(fields))nodes['wf-'+id]=new Element('input',value);
nodes['wf-case'].value='complet';
const choices=['devis','stock','document'].map(id=>{const btn=new Element('button');btn.dataset.wfPreset=id;return btn});
const document={
 getElementById:id=>nodes[id]||null,
 querySelectorAll:()=>choices,
 createElement:tag=>new Element(tag),
 body:new Element('body')
};
const sandbox={window:{},document,
 Blob:class FakeBlob{constructor(parts,opts){this.parts=parts;this.opts=opts}},
 URL:{createObjectURL(){urls++;return 'blob:local'},revokeObjectURL(){revoked++}},
 setTimeout:fn=>fn(),console,fetch(){requests++;throw Error('External call forbidden')}
};
vm.runInNewContext(src,sandbox,{filename:'workflow-studio.js',timeout:2500});
const core=sandbox.window.STUDIO_WORKFLOW_CORE;
check(!!core&&typeof core.simulate==='function','Workflow core not exported');
for(const preset of Object.values(core.presets)){
 check(core.validate(preset).valid,'Invalid preset');
 check(core.plan(preset).length===preset.steps.length+6,'Missing mandatory gates');
 for(const [scenario,expected] of Object.entries({complet:'pending_approval',incomplet:'blocked_missing',doublon:'blocked_duplicate',autorisation:'blocked_permission'})){
  const r=core.simulate(preset,scenario);
  check(r.status===expected,'Scenario '+scenario+' failed');
  check(r.executable===false,'A scenario attempted external execution');
 }
 const approve=core.simulate(preset,'complet',true);
 check(approve.status==='approved_preview'&&!approve.executable,'Approval must remain a simulation');
 const exportText=core.exportJson(preset);
 const json=JSON.parse(exportText);
 check(json.enabled===false&&json.mode==='simulation-only','JSON may enable live automation');
 check(json.controls.humanApproval===true&&json.controls.duplicateProtection===true,'Missing safety controls');
 check(core.exportGuide(preset).includes('AUCUNE AUTOMATISATION'),'Missing nonexecution notice');
}
check(!core.validate({...core.presets.devis,owner:''}).valid,'Missing owner not detected');
check(!core.validate({...core.presets.devis,steps:[]}).valid,'Missing steps not detected');
check(!core.validate({...core.presets.devis,steps:['Réviser','réviser']}).valid,'Duplicate steps not detected');
check(core.simulate(core.presets.devis,'unknown').status==='invalid','Unknown scenario should fail closed');
check(nodes['wf-steps'].children.length===2,'Default steps not rendered');
check(nodes['wf-plan'].children.length===8,'Mandatory steps not rendered');
check(nodes['wf-health'].dataset.valid==='true','Default plan not valid');
check(nodes['wf-approve'].disabled===true,'Approval active before test');
nodes['wf-run'].listeners.click();
check(nodes['wf-result'].dataset.result==='pending_approval','Complete scenario should await approval');
check(!nodes['wf-approve'].disabled,'Approval not available after good simulation');
nodes['wf-approve'].listeners.click();
check(nodes['wf-result'].dataset.result==='approved_preview','Simulation approval failed');
for(const [scenario,status] of Object.entries({doublon:'blocked_duplicate',incomplet:'blocked_missing',autorisation:'blocked_permission'})){
 nodes['wf-case'].value=scenario;nodes['wf-case'].listeners.change();nodes['wf-run'].listeners.click();
 check(nodes['wf-result'].dataset.result===status,'UI did not block '+scenario);
 check(nodes['wf-approve'].disabled===true,'Approval should be blocked '+scenario);
}
choices[1].listeners.click();
check(nodes['wf-title'].value==='Réagir à un stock faible','Stock preset loading failed');
nodes['wf-new-step'].value='Contrôler le fournisseur';
nodes['wf-add-step'].listeners.click();
check(nodes['wf-steps'].children.length===3,'Add step failed');
nodes['wf-steps'].children[0].children[1].listeners.click();
check(nodes['wf-steps'].children.length===2,'Remove step failed');
nodes['wf-owner'].value='';nodes['wf-owner'].listeners.input();
check(nodes['wf-health'].dataset.valid==='false','Invalid owner not flagged');
check(nodes['wf-export-json'].disabled===true,'Export with invalid owner enabled');
choices[2].listeners.click();
nodes['wf-export-json'].listeners.click();
nodes['wf-export-txt'].listeners.click();
check(downloads===2&&urls===2&&revoked===2,'Local exports or URL revocation failed');
check(requests===0,'Network request not allowed');
check(ui.includes('workflow-studio.js')&&ui.includes('workflow-studio.css'),'UI lacks linked script or style');
check(read('assets/data.js').includes('Construire et tester un workflow'),'Deep product link missing');
check(read('assets/resources-data.js').includes("id:'o-workflow'"),'Resources entry missing');
console.log('OK — '+count+' contrôles LIV-03 : trois exemples, quatre cas, garde-fous, validation et deux exports, sans réseau.');
