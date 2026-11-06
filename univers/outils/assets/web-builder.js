/* Studio IA / LIV-04B — constructeur de page web locale. Aucun service connecté. */
(()=>{
'use strict';
const palettes={
  cream:{label:'Crème & orange',background:'#FFF5EE',surface:'#FFFFFF',ink:'#111827',muted:'#485567',accent:'#FF6A3D',onAccent:'#111827',border:'#E7D7CD'},
  navy:{label:'Bleu & ivoire',background:'#F1F5FA',surface:'#FFFFFF',ink:'#17283E',muted:'#495B6D',accent:'#285C99',onAccent:'#FFFFFF',border:'#D5E0EC'},
  forest:{label:'Forêt & sable',background:'#F8F5ED',surface:'#FFFFFF',ink:'#23392F',muted:'#4A5E53',accent:'#375D49',onAccent:'#FFFFFF',border:'#E1E6D9'}
};
const layouts=new Set(['editorial','services','portfolio']);
const fields=['brand','headline','pitch','audience','offer1','offer2','offer3','cta','email','layout','palette'];
const presets={
  artisan:{brand:'Atelier Sillage',headline:'Des espaces pensés pour vous.',pitch:'Nous imaginons des rangements personnalisés pour accompagner vos projets d’aménagement.',audience:'les particuliers qui souhaitent aménager leur intérieur',offer1:'Un échange pour comprendre vos besoins',offer2:'Un projet adapté aux dimensions disponibles',offer3:'Une proposition à valider avant réalisation',cta:'Présenter mon projet',email:'bonjour@example.com',layout:'editorial',palette:'cream'},
  conseil:{brand:'Clair Conseil',headline:'Votre idée mérite un plan clair.',pitch:'Un accompagnement pour structurer les prochaines étapes de votre activité.',audience:'les entrepreneurs qui lancent un nouveau service',offer1:'Un diagnostic des besoins',offer2:'Une feuille de route priorisée',offer3:'Un point de suivi pour ajuster la méthode',cta:'Demander un rendez-vous',email:'contact@example.com',layout:'services',palette:'navy'},
  studio:{brand:'Collectif Lumière',headline:'Des créations à partager.',pitch:'Un studio indépendant pour donner forme à des contenus et des expériences accessibles.',audience:'les équipes et porteurs de projets créatifs',offer1:'Direction artistique',offer2:'Supports éditoriaux et numériques',offer3:'Accompagnement à la diffusion',cta:'Échanger sur une idée',email:'equipe@example.com',layout:'portfolio',palette:'forest'}
};
const limits={brand:65,headline:100,pitch:250,audience:130,offer1:110,offer2:110,offer3:110,cta:55,email:160};
const trim=x=>String(x??'').replace(/[\u0000-\u001F\u007F]+/g,' ').replace(/\s+/g,' ').trim();
const normalize=raw=>{
 const v=raw||{},out={};
 for(const [k,max] of Object.entries(limits))out[k]=trim(v[k]).slice(0,max);
 out.layout=layouts.has(v.layout)?v.layout:'editorial';
 out.palette=Object.prototype.hasOwnProperty.call(palettes,v.palette)?v.palette:'cream';
 return out;
};
const escapeHtml=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const emailValid=x=>/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trim(x))&&trim(x).length<=160&&!trim(x).includes('..')&&!/@(?:example\.(?:com|org|net)|[^@]+\.(?:test|invalid))$/i.test(trim(x));
const lin=x=>{const r=x/255;return r<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4)};
const luminance=x=>{const c=[1,3,5].map(i=>lin(parseInt(x.slice(i,i+2),16)));return c[0]*.2126+c[1]*.7152+c[2]*.0722};
const contrast=(x,y)=>{const a=luminance(x),b=luminance(y);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
function quality(raw){
 const v=normalize(raw),p=palettes[v.palette];
 return[
 {key:'brand',ok:v.brand.length>=3,label:'Identité renseignée'},
 {key:'promise',ok:v.headline.length>=9&&v.pitch.length>=25,label:'Accroche et présentation complètes'},
 {key:'offer',ok:[v.offer1,v.offer2,v.offer3].every(x=>x.length>=6),label:'Trois éléments d’offre renseignés'},
 {key:'cta',ok:v.cta.length>=5,label:'Appel à l’action clair'},
 {key:'contact',ok:emailValid(v.email),label:'Adresse e-mail de contact valide'},
 {key:'contrast',ok:contrast(p.ink,p.background)>=4.5&&contrast(p.onAccent,p.accent)>=4.5,label:'Contraste texte/fond suffisant'}
 ];
}
function css(p){
 return [
 ':root{color-scheme:light;--bg:',p.background,';--surface:',p.surface,';--ink:',p.ink,
 ';--muted:',p.muted,';--accent:',p.accent,';--accent-ink:',p.onAccent,';--line:',p.border,'}',
 '*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:85px}',
 'body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.7 Arial,Helvetica,sans-serif}',
 'a{color:inherit}button,a{touch-action:manipulation}a:focus-visible{outline:3px solid var(--accent);outline-offset:5px}',
 '.skip{position:absolute;left:15px;top:-100px;background:var(--surface);padding:12px;z-index:10}.skip:focus{top:12px}',
 '.wrap{width:min(1180px,calc(100% - 64px));margin:auto}',
 '.header{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid var(--line);padding:23px 0}',
 '.logo{font-size:21px;font-weight:800;letter-spacing:-.04em;text-decoration:none}',
 '.nav{display:flex;align-items:center;gap:24px;font-size:13px;font-weight:700}.nav a{text-decoration:none}.nav a:hover{text-decoration:underline}',
 '.hero{padding:100px 0 105px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.55fr);align-items:end;gap:60px}',
 '.overline{display:block;color:var(--muted);text-transform:uppercase;letter-spacing:.14em;font-weight:750;font-size:11px;margin-bottom:20px}',
 'h1{font-size:clamp(47px,6.5vw,93px);line-height:1.06;letter-spacing:-.065em;margin:0 0 27px;max-width:900px}',
 '.lead{font-size:clamp(17px,1.9vw,21px);line-height:1.65;color:var(--muted);max-width:660px;margin:0 0 30px}',
 '.button{display:inline-flex;align-items:center;justify-content:center;min-height:50px;max-width:100%;padding:13px 20px;background:var(--accent);color:var(--accent-ink);border-radius:10px;font-weight:800;font-size:13px;text-decoration:none;overflow-wrap:anywhere}',
 '.button:hover{filter:brightness(.95)}.hero-aside{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:31px}',
 '.hero-aside strong{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.09em;margin-bottom:15px}',
 '.hero-aside p{color:var(--muted);font-size:15px;line-height:1.6;margin:0}',
 '.section{padding:75px 0;border-top:1px solid var(--line)}',
 '.section h2{font-size:clamp(30px,4vw,48px);line-height:1.12;letter-spacing:-.055em;margin:10px 0 20px}',
 '.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:34px}',
 '.tile{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:26px;min-height:178px}',
 '.tile span{font-size:12px;color:var(--muted);letter-spacing:.08em}.tile h3{font-size:21px;line-height:1.35;letter-spacing:-.03em;margin:27px 0 0;overflow-wrap:anywhere}',
 '.audience{max-width:680px;color:var(--muted);font-size:18px}.contact{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:45px;display:flex;align-items:center;justify-content:space-between;gap:20px}',
 '.contact p{color:var(--muted);margin:9px 0 0;max-width:500px;overflow-wrap:anywhere}',
 '.footer{display:flex;justify-content:space-between;gap:24px;border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:12px}',
 '.page--editorial .hero{grid-template-columns:minmax(0,1fr) minmax(0,.5fr)}',
 '.page--editorial .hero-aside{border-left:6px solid var(--accent)}',
 '.page--services .hero{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:55px 60px;margin-top:55px}',
 '.page--services .tile{border-top:5px solid var(--accent)}',
 '.page--portfolio .hero{grid-template-columns:1fr;gap:0;padding-top:110px}.page--portfolio .hero-aside{max-width:600px;margin-top:30px}',
 '.page--portfolio .tile{background:var(--accent);color:var(--accent-ink);border:0}.page--portfolio .tile span{color:var(--accent-ink);opacity:.8}',
 '.page--portfolio .section h2{font-size:clamp(36px,5vw,64px)}',
 '@media(max-width:800px){.wrap{width:min(100% - 34px,680px)}.header{flex-wrap:wrap}.nav{gap:14px;flex-wrap:wrap;font-size:12px}',
 '.hero,.page--services .hero{grid-template-columns:1fr;padding:55px 0;gap:24px}.page--services .hero{padding:30px;margin-top:28px}',
 'h1{font-size:clamp(40px,8vw,62px)}.grid{grid-template-columns:1fr}.section{padding:52px 0}.tile{min-height:120px}',
 '.contact{flex-direction:column;align-items:flex-start;padding:27px}.footer{flex-wrap:wrap}}',
 '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'
 ].join('');
}
function build(raw){
 const v=normalize(raw),p=palettes[v.palette];
 const escape=escapeHtml;
 const contact=emailValid(v.email)?'<a class="button" href="mailto:'+escape(v.email)+'">'+escape(v.cta||'Écrire un message')+'</a>':
   '<p>Adresse de contact à compléter avant toute publication.</p>';
 const tiles=[v.offer1,v.offer2,v.offer3].map((text,i)=>
  '<article class="tile"><span>0'+(i+1)+' / POINT CLÉ</span><h3>'+escape(text||'Élément à préciser')+'</h3></article>').join('');
 const style=css(p);
 return [
 '<!doctype html><html lang="fr"><head><meta charset="utf-8">',
 '<meta name="viewport" content="width=device-width,initial-scale=1">',
 '<meta name="color-scheme" content="light">',
 '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; style-src &#39;unsafe-inline&#39;; base-uri &#39;none&#39;; form-action &#39;none&#39;; object-src &#39;none&#39;">',
 '<meta name="description" content="'+escape(v.pitch)+'">',
 '<title>'+escape(v.brand||'Page de démonstration')+' — Présentation</title>',
 '<style>',style,'</style></head>',
 '<body class="page--'+escape(v.layout)+'"><a class="skip" href="#contenu">Aller au contenu</a>',
 '<div class="wrap" id="top"><header class="header"><a href="#top" class="logo">'+escape(v.brand||'Nom de l’activité')+'</a>',
 '<nav class="nav" aria-label="Navigation principale"><a href="#offre">Notre offre</a><a href="#apropos">Pour qui</a><a href="#contact">Contact</a></nav></header>',
 '<main id="contenu"><section class="hero" aria-labelledby="titre"><div><span class="overline">DÉCOUVRIR / '+escape(v.brand||'MON ACTIVITÉ')+'</span>',
 '<h1 id="titre">'+escape(v.headline||'Votre titre ici')+'</h1><p class="lead">'+escape(v.pitch||'Une brève présentation de votre activité.')+'</p>',
 '<a class="button" href="#contact">'+escape(v.cta||'Prendre contact')+'</a></div>',
 '<aside class="hero-aside"><strong>Une approche concrète</strong><p>'+escape(v.audience||'Décrivez ici les personnes que vous accompagnez.')+'</p></aside></section>',
 '<section class="section" id="offre" aria-labelledby="offre-titre"><span class="overline">CE QUE NOUS PROPOSONS</span>',
 '<h2 id="offre-titre">Trois points essentiels.</h2><div class="grid">'+tiles+'</div></section>',
 '<section class="section" id="apropos" aria-labelledby="apropos-titre"><span class="overline">NOTRE PUBLIC</span>',
 '<h2 id="apropos-titre">Pour qui ?</h2><p class="audience">'+escape(v.audience||'Décrivez votre public cible.')+'</p></section>',
 '<section class="section" id="contact" aria-labelledby="contact-titre"><div class="contact"><div><span class="overline">PROCHAIN ÉCHANGE</span>',
 '<h2 id="contact-titre">Parlons de votre projet.</h2><p>Un premier échange pour voir si notre approche correspond à vos besoins.</p>',
 '</div>',contact,'</div></section></main>',
 '<footer class="footer"><span>'+escape(v.brand||'Votre activité')+'</span><span>Page de démonstration à relire avant publication.</span></footer></div></body></html>'
 ].join('');
}
function guide(raw){
 const v=normalize(raw);
 return [
 'STUDIO IA — BRIEF DE SITE WEB / DÉMONSTRATION GRATUITE','',
 'Entreprise : '+v.brand,'Accroche : '+v.headline,'Présentation : '+v.pitch,
 'Public cible : '+v.audience,'Offre 01 : '+v.offer1,'Offre 02 : '+v.offer2,'Offre 03 : '+v.offer3,
 'Appel à l’action : '+v.cta,'Contact : '+v.email,
 'Mise en page : '+({editorial:'Éditoriale',services:'Services',portfolio:'Portfolio'}[v.layout]),
 'Palette : '+palettes[v.palette].label,'',
 'STRUCTURE','- Navigation simple vers Offre, Pour qui, Contact',
 '- Accroche et CTA visible','- Trois éléments d’offre','- Public cible','- Contact en e-mail si valide',
 '', 'RECETTE AVANT MISE EN LIGNE','- Relire toutes les affirmations, les coordonnées et les droits.',
 '- Tester la page sur mobile et ordinateur.',
 '- Vérifier les liens, le rendu à petite taille et la compatibilité navigateur.',
 '- Compléter les mentions légales, la politique de confidentialité et les obligations adaptées à l’activité.',
 '- Publier seulement après validation; aucun hébergement ou domaine n’est fourni par cet atelier.',
 '', 'Page HTML statique autonome et sans script, créée localement dans votre navigateur.'
 ].join('\n');
}
const core={palettes,presets,normalize,escapeHtml,emailValid,contrast,quality,build,guide};
if(typeof window!=='undefined')window.TESTIA_WEB_CORE=core;
if(typeof document==='undefined')return;
const root=document.getElementById('webPrototypeStudio');if(!root)return;
const $=id=>document.getElementById(id);
const controls=['brand','headline','pitch','audience','offer1','offer2','offer3','cta','email','layout','palette'];
let mode='desktop';
const iframe=$('wb-preview');
function render(){
 const v=Object.fromEntries(controls.map(x=>[x,$('wb-'+x).value]));
 iframe.srcdoc=build(v);
 const rules=quality(v),list=$('wb-checks');list.replaceChildren();
 let passed=0;
 for(const item of rules){
  if(item.ok)passed++;
  const row=document.createElement('li');row.className=item.ok?'wb-pass':'wb-warning';
  row.textContent=(item.ok?'✓ ':'À vérifier · ')+item.label;list.append(row);
 }
 $('wb-count').textContent=passed+' / '+rules.length+' points de contrôle';
 $('wb-brief').value=guide(v);
 $('wb-download-html').disabled=!v.headline.trim();
 $('wb-export-brief').disabled=!v.brand.trim();
 return v;
}
function preset(id){
 const p=presets[id];if(!p)return;
 for(const field of controls)$('wb-'+field).value=p[field]||'';
 document.querySelectorAll('[data-web-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.webPreset===id)));
 render();$('wb-status').textContent='Exemple chargé. Modifiez les textes et comparez les versions.';
}
function resizePreview(){
 const holder=$('wb-device');
 const width=mode==='mobile'?390:1100;
 const height=mode==='mobile'?810:840;
 const available=holder.clientWidth||560;
 const scale=Math.min(1,Math.max(.2,available/width));
 iframe.style.width=width+'px';
 iframe.style.height=height+'px';
 iframe.style.transform='scale('+scale+')';
 holder.style.height=Math.ceil(height*scale)+'px';
}
function view(value){
 mode=value==='mobile'?'mobile':'desktop';
 $('wb-device').dataset.device=mode;
 resizePreview();
 document.querySelectorAll('[data-web-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.webDevice===mode)));
 $('wb-status').textContent=mode==='mobile'?'Aperçu mobile à largeur réduite.':'Aperçu ordinateur.';
}
function download(name,content,type){
 const blob=new Blob([content],{type:type+';charset=utf-8'});
 const uri=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=uri;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1000);
 $('wb-status').textContent='Fichier téléchargé localement. Le site n’a pas été mis en ligne.';
}
controls.forEach(field=>['input','change'].forEach(event=>$('wb-'+field).addEventListener(event,()=>{
 render();$('wb-status').textContent='Aperçu recalculé. Pensez à relire les points de contrôle.';
})));
document.querySelectorAll('[data-web-preset]').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.webPreset)));
document.querySelectorAll('[data-web-device]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.webDevice)));
 if(typeof window!=='undefined'&&typeof window.addEventListener==='function')window.addEventListener('resize',resizePreview);
$('wb-download-html').addEventListener('click',()=>{
 const v=render();if(!v.headline.trim())return;
 download('studio-ia-site-demo.html',build(v),'text/html');
});
$('wb-export-brief').addEventListener('click',()=>{
 const v=render();if(!v.brand.trim())return;
 download('studio-ia-brief-site.txt',guide(v),'text/plain');
});
$('wb-copy-code').addEventListener('click',async()=>{
 const v=render(),code=build(v);
 if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText){
  try{await navigator.clipboard.writeText(code);$('wb-status').textContent='Code HTML copié.';return;}catch(_error){}
 }
 const fallback=$('wb-code-fallback');fallback.hidden=false;fallback.value=code;fallback.focus();fallback.select();
 $('wb-status').textContent='Code sélectionné. Utilisez Ctrl+C ou Cmd+C.';
});
preset('artisan');
view('desktop');
})();