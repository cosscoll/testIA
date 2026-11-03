/* Global navigation, keyboard and mobile accessible. No tracking or network calls. */
(()=>{
 'use strict';
 const header=document.querySelector('.global-header');
 if(!header)return;
 const button=header.querySelector('.global-menu-toggle');
 const menu=header.querySelector('.global-mobile-nav');
 if(!button||!menu)return;
 const setOpen=open=>{
   const expanded=Boolean(open);
   button.setAttribute('aria-expanded',String(expanded));
   button.setAttribute('aria-label',expanded?'Fermer le menu':'Ouvrir le menu');
   menu.hidden=!expanded;
 };
 button.addEventListener('click',()=>setOpen(menu.hidden));
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!menu.hidden){setOpen(false);button.focus()}
 });
 document.addEventListener('pointerdown',event=>{
   if(!menu.hidden&&!header.contains(event.target))setOpen(false)
 });
 window.matchMedia('(min-width: 821px)').addEventListener?.('change',event=>{
   if(event.matches)setOpen(false);
 });
 setOpen(false);
})();