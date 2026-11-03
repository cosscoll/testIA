/* Banque Outils IA — hero kinetic 3D pages. No network, no payment, no fabricated AI output. */
(()=>{
  'use strict';
  const stage=document.getElementById('kineticStage');
  const toggleButton=document.getElementById('kineticToggle');
  const toggleLabel=document.getElementById('kineticToggleText');
  if(!stage||!toggleButton)return;
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let hovered=false,pinned=false,open=false;
  // Lift the exact card under the pointer (or keyboard focus) above every other layer.
  const cards=[...stage.querySelectorAll('.op-card')];
  let featuredCard=null;
  let clearFeatureTimer=null;
  function feature(card){
    window.clearTimeout(clearFeatureTimer);
    if(featuredCard===card)return;
    featuredCard=card;
    stage.classList.toggle('has-featured',Boolean(card));
    for(const item of cards)item.classList.toggle('is-featured',item===card);
  }
  for(const card of cards){
    card.addEventListener('pointerenter',event=>{
      if(finePointer.matches&&event.pointerType!=='touch')feature(card);
    });
    card.addEventListener('pointerleave',event=>{
      if(event.pointerType==='touch')return;
      window.clearTimeout(clearFeatureTimer);
      clearFeatureTimer=window.setTimeout(()=>{
        if(featuredCard===card&&!card.matches(':hover')&&!card.contains(document.activeElement))feature(null);
      },90);
    });
    card.addEventListener('focusin',()=>feature(card));
    card.addEventListener('focusout',()=>{
      window.clearTimeout(clearFeatureTimer);
      clearFeatureTimer=window.setTimeout(()=>{
        if(featuredCard===card&&!card.contains(document.activeElement))feature(null);
      },0);
    });
  }
  // Geometry-based hit test is intentional. In a transformed 3D stack, elements
  // visually behind another plane or editorial column may NEVER receive pointerenter.
  // Capture pointer motion at document level and select the projected card rectangle.
  // This specifically fixes VIDEO and TEXTE, whose DOM hover could not be reached.
  const leftCards=cards.filter(card=>card.classList.contains('op-card--video')||card.classList.contains('op-card--texte'));
  let projectedLeftRects=[];
  function snapshotLeftRects(){
    projectedLeftRects=leftCards.map(card=>({card,rect:card.getBoundingClientRect()}));
  }
  function within(rect,x,y){
    return rect.width>0&&rect.height>0&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;
  }
  function closestLeftCard(x,y){
    const matches=projectedLeftRects.filter(({rect})=>within(rect,x,y));
    if(!matches.length)return null;
    matches.sort((a,b)=>{
      const score=v=>{
        const r=v.rect;
        return Math.pow((x-(r.left+r.right)/2)/r.width,2)+Math.pow((y-(r.top+r.bottom)/2)/r.height,2);
      };
      return score(a)-score(b);
    });
    return matches[0].card;
  }
  // Capture is used so the listener runs even when a transparent overlay receives
  // the event instead of the actual link. Ignore header and CTA hit areas.
  document.addEventListener('pointermove',event=>{
    if(!finePointer.matches||event.pointerType==='touch')return;
    const bounds=stage.getBoundingClientRect();
    if(!within(bounds,event.clientX,event.clientY)){
      if(leftCards.includes(featuredCard)&&!featuredCard.contains(document.activeElement))feature(null);
      return;
    }
    const nativeCard=event.target instanceof Element?event.target.closest('.op-card'):null;
    if(nativeCard&&cards.includes(nativeCard)){
      // Native pointer selection wins whenever a front card is actually targeted.
      if(featuredCard!==nativeCard)feature(nativeCard);
      return;
    }
    if(event.target instanceof Element&&event.target.closest('a,button,input,textarea,select'))return;
    // Recalculate only while no left card is lifted: its animated rectangle would
    // otherwise change the hit area and cause flicker.
    if(!leftCards.includes(featuredCard))snapshotLeftRects();
    const card=closestLeftCard(event.clientX,event.clientY);
    if(card){
      hovered=true;render();feature(card);
    }else if(leftCards.includes(featuredCard)&&!featuredCard.contains(document.activeElement)){
      feature(null);
    }
  },{capture:true,passive:true});
  // For the same intercepted areas, preserve the navigation to the actual tool bank.
  document.addEventListener('click',event=>{
    if(!finePointer.matches||!(event.target instanceof Element))return;
    if(event.target.closest('a,button,input,textarea,select'))return;
    const rect=stage.getBoundingClientRect();
    if(!within(rect,event.clientX,event.clientY))return;
    if(!leftCards.includes(featuredCard))snapshotLeftRects();
    const card=closestLeftCard(event.clientX,event.clientY);
    if(!card)return;
    event.preventDefault();
    window.location.assign(card.href);
  },true);
  function resetTilt(){
    stage.style.setProperty('--rx','6deg');
    stage.style.setProperty('--ry','-19deg');
  }
  function render(){
    open=hovered||pinned;
    stage.dataset.open=String(open);
    toggleButton.setAttribute('aria-pressed',String(pinned));
    toggleButton.setAttribute('aria-label',pinned?'Refermer les cartes de découverte':'Déployer les cartes de découverte');
    toggleLabel.textContent=pinned?'Réduire les cartes':finePointer.matches?'Survolez pour explorer les outils':'Touchez pour découvrir les outils';
  }
  stage.addEventListener('pointerenter',event=>{
    if(!finePointer.matches||event.pointerType==='touch')return;
    hovered=true;render();
  });
  stage.addEventListener('pointermove',event=>{
    if(!finePointer.matches||reduceMotion.matches||event.pointerType==='touch'||featuredCard)return;
    const bounds=stage.getBoundingClientRect();
    if(!bounds.width||!bounds.height)return;
    const nx=Math.max(-1,Math.min(1,2*(event.clientX-bounds.left)/bounds.width-1));
    const ny=Math.max(-1,Math.min(1,2*(event.clientY-bounds.top)/bounds.height-1));
    stage.style.setProperty('--ry',(-19+nx*10).toFixed(2)+'deg');
    stage.style.setProperty('--rx',(6-ny*8).toFixed(2)+'deg');
  },{passive:true});
  stage.addEventListener('pointerleave',event=>{
    if(event.pointerType==='touch')return;
    // CSS 3D hit testing can emit pointerleave even while the pointer visually
    // remains over a card. Only close when actually outside the stage rectangle.
    if(within(stage.getBoundingClientRect(),event.clientX,event.clientY))return;
    hovered=false;resetTilt();if(!cards.some(card=>card.contains(document.activeElement)))feature(null);render();
  });
  toggleButton.addEventListener('click',()=>{
    pinned=!pinned;render();
  });
  // Preserve discoverability for non-hover devices and changing pointer capabilities.
  if(finePointer.addEventListener)finePointer.addEventListener('change',()=>{hovered=false;resetTilt();render()});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&pinned){pinned=false;hovered=false;resetTilt();render();toggleButton.focus()}
  });
  const menu=document.querySelector('.mobile-menu-toggle');
  const mobile=document.getElementById('mobile-menu');
  if(menu&&mobile){
    function setMenu(open){
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
      menu.textContent=open?'FERMER ×':'MENU ☰';
      mobile.hidden=!open;
    }
    menu.addEventListener('click',()=>setMenu(mobile.hidden));
    mobile.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!mobile.hidden){setMenu(false);menu.focus()}
    });
  }
  render();
  window.__kineticHero={version:4,theme:'obscure-pop',isOpen:()=>open,featured:()=>featuredCard?.className||null};
})();
