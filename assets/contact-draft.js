/* Studio IA : copie locale d'un brouillon de contact.
   Aucun envoi, aucune collecte serveur et aucune sauvegarde. */
(()=>{
  'use strict';
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('contactForm');
    const copy=document.getElementById('contactCopy');
    const feedback=document.getElementById('contactCopyStatus');
    if(!form||!copy||!feedback)return;
    // Les demandes issues du coffre sont préremplies uniquement pour des IDs
    // présents dans le catalogue. Aucune information personnelle n'est stockée.
    const productId=new URLSearchParams(location.search).get('produit');
    const product=(window.TESTIA_PRODUCTS||[]).find(item=>item.id===productId);
    if(product){
      const subject=document.getElementById('contactSubject');
      const message=document.getElementById('contactMessage');
      if(subject&&message){
        subject.value=('Disponibilité de l’offre : '+product.title).slice(0,100);
        message.value='Bonjour, je souhaite connaître la disponibilité et les modalités d’achat de l’offre « '+product.title+' ». Merci de préciser à quel moment elle sera commercialisée.';
        feedback.textContent='Demande préremplie pour '+product.title+'. Vous pouvez copier ce brouillon ; il n’est pas envoyé automatiquement.';
      }
    }
    let manual=null;
    copy.addEventListener('click',async()=>{
      if(!form.reportValidity()){
        feedback.textContent='Complétez le sujet et le message avant de copier votre brouillon.';
        return;
      }
      const subject=document.getElementById('contactSubject').value.trim();
      const body=document.getElementById('contactMessage').value.trim();
      if(subject.length<5||body.length<15){
        feedback.textContent='Le sujet ou le message est trop court.';
        return;
      }
      const draft='Sujet : '+subject+'\n\n'+body;
      try{
        if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(draft);
        feedback.textContent='Brouillon copié. Vous pouvez le coller dans le canal privé de votre choix. Aucun message n’a été envoyé.';
        manual?.remove();manual=null;
      }catch{
        if(!manual){
          manual=document.createElement('textarea');
          manual.id='contactManualDraft';
          manual.className='contact-manual-draft';
          manual.readOnly=true;
          manual.setAttribute('aria-label','Brouillon à copier manuellement');
          feedback.after(manual);
        }
        manual.value=draft;
        manual.focus();
        manual.select();
        feedback.textContent='La copie automatique n’est pas disponible : le brouillon est sélectionné ci-dessous. Copiez-le avec Ctrl+C ou Cmd+C. Aucun message n’a été envoyé.';
      }
    });
  });
})();
