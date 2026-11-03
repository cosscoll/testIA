/* Banque Outils IA — générateur de brouillons local.
   Ne transmet aucun champ. Compose des modèles, sans IA générative. */
(()=>{
  'use strict';
  const form=document.getElementById('messageForm');
  if(!form)return;
  const output=document.getElementById('messageOutput');
  const status=document.getElementById('messageStatus');
  const copy=document.getElementById('copyMessage');
  const save=document.getElementById('saveMessage');
  const value=id=>document.getElementById(id).value.trim().replace(/\s+/g,' ');
  const fragment=s=>s.replace(/[.!?;,\s]+$/g,'').trim();
  const sentence=s=>/[.!?…]$/.test(s.trim())?s.trim():s.trim()+'.';
  const upper=s=>s.charAt(0).toLocaleUpperCase('fr')+s.slice(1);
  const validChannel=new Set(['email','post','web']);
  const validTone=new Set(['pro','warm','direct']);
  const introductions={
    pro:'Voici une proposition adaptée à vos besoins.',
    warm:'Nous souhaitons partager avec vous une idée à découvrir.',
    direct:'Voici notre proposition, en bref.'
  };
  const hooks={
    pro:'Une proposition à découvrir',
    warm:'Une idée à partager',
    direct:'En bref'
  };
  const webHeadings={
    pro:'Notre approche',
    warm:'Avançons ensemble',
    direct:'L’essentiel'
  };

  function build(v){
    if(v.channel==='email'){
      return [
        'Objet : '+upper(fragment(v.benefit))+' — '+v.business,'',
        'Bonjour,','',
        introductions[v.tone],'',
        'Notre activité : '+sentence(v.business),
        'Notre offre : '+sentence(v.offer),
        'Public concerné : '+sentence(v.audience),
        'Bénéfice recherché : '+sentence(v.benefit),'',
        sentence(v.cta),'',
        v.tone==='warm'?'Au plaisir d’échanger,':'Bien cordialement,',
        v.business
      ].join('\n');
    }
    if(v.channel==='post'){
      return [
        hooks[v.tone]+' · '+v.business,'',
        v.business+' propose '+sentence(v.offer),
        'Public concerné : '+sentence(v.audience),
        'Objectif : '+sentence(v.benefit),'',
        sentence(v.cta)
      ].join('\n');
    }
    return [
      webHeadings[v.tone],'',
      'Notre objectif : '+sentence(v.benefit),'',
      v.business+' propose '+sentence(v.offer),
      'Public concerné : '+sentence(v.audience),'',
      sentence(v.cta)
    ].join('\n');
  }

  function syncExport(){
    const hasText=output.value.trim().length>0;
    copy.disabled=!hasText;
    save.disabled=!hasText;
  }

  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const values={
      business:value('business'),audience:value('audience'),
      offer:value('offer'),benefit:value('benefit'),cta:value('cta'),
      channel:value('channel'),tone:value('tone')
    };
    if(Object.values(values).some(x=>!x)||!validChannel.has(values.channel)||!validTone.has(values.tone)){
      status.textContent='Complétez les champs requis et choisissez un format valide.';
      return;
    }
    output.value=build(values);
    syncExport();
    status.textContent='Brouillon créé sur votre appareil. Relisez-le et modifiez-le librement.';
  });

  output.addEventListener('input',()=>{
    syncExport();
    status.textContent=output.value.trim()?'Brouillon modifié. Vous pouvez copier ou exporter cette version.':'Brouillon vide. Créez un nouveau texte.';
  });
  form.addEventListener('input',()=>{
    if(output.value.trim())status.textContent='Les champs ont changé. Cliquez sur « Créer mon brouillon » pour recalculer le texte.';
  });

  copy.addEventListener('click',async()=>{
    if(!output.value.trim())return;
    if(navigator.clipboard&&navigator.clipboard.writeText){
      try{
        await navigator.clipboard.writeText(output.value);
        status.textContent='Texte copié.';
        return;
      }catch(error){/* Sélection manuelle de secours. */}
    }
    output.focus();output.select();
    status.textContent='Texte sélectionné : utilisez Ctrl+C ou Cmd+C pour le copier.';
  });

  save.addEventListener('click',()=>{
    if(!output.value.trim())return;
    const blob=new Blob([output.value],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='banque-outils-ia-brouillon.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Fichier texte préparé sur votre appareil.';
  });

  form.addEventListener('reset',()=>{
    output.value='';
    syncExport();
    status.textContent='Exemple restauré.';
  });
})();
