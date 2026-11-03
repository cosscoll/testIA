/* Static showroom interactions — no paid service, analytics or remote requests. */
(()=>{
'use strict';
const scene=document.querySelector('[data-showroom]');
if(!scene)return;
const deck=scene.querySelector('.showroom-deck');
const cards=[...scene.querySelectorAll('.showroom-object')];
const buttons=[...scene.querySelectorAll('[data-focus-card]')];
const fine=window.matchMedia('(hover:hover) and (pointer:fine)');
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
let active=-1,locked=-1;
function activate(index){
 active=index;
 cards.forEach((card,i)=>{card.classList.toggle('is-spotlit',i===index);});
 buttons.forEach(button=>{button.setAttribute('aria-pressed',String(Number(button.dataset.focusCard)===index));});
 scene.classList.toggle('is-open',index<0);
}
buttons.forEach(button=>button.addEventListener('click',()=>{
 const index=Number(button.dataset.focusCard);
 locked=locked===index?-1:index;
 activate(locked);
}));
cards.forEach((card,index)=>{
 card.addEventListener('pointerenter',event=>{
  if(!fine.matches||event.pointerType==='touch'||locked>=0)return;
  activate(index);
 });
 card.addEventListener('pointerleave',event=>{
  if(event.pointerType==='touch')return;
  if(locked>=0){activate(locked);return;}
  activate(-1);
 });
});
scene.addEventListener('pointermove',event=>{
 if(!fine.matches||reduced.matches||active>=0||!deck)return;
 const bounds=scene.getBoundingClientRect();
 const x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
 const y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
 deck.style.setProperty('--tilty',(x*7).toFixed(2)+'deg');
 deck.style.setProperty('--tiltx',(-y*5).toFixed(2)+'deg');
},{passive:true});
scene.addEventListener('pointerleave',()=>{
 if(locked<0)activate(-1);
 if(deck){deck.style.removeProperty('--tilty');deck.style.removeProperty('--tiltx');}
});
const demo=document.getElementById('demo-action'),output=document.getElementById('demo-result');
if(demo&&output){
 const initial=output.textContent;
 const result=output.dataset.after||initial;
 demo.addEventListener('click',()=>{
  const on=demo.getAttribute('aria-pressed')!=='true';
  demo.setAttribute('aria-pressed',String(on));
  demo.textContent=on?'Revenir à la demande ↶':'Lancer la simulation ↗';
  output.textContent=on?result:initial;
 });
}
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&locked>=0){locked=-1;activate(-1)}
});
activate(-1);
})();
