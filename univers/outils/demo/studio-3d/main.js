import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const canvas=document.getElementById('scene'), status=document.getElementById('status');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}
catch(e){status.textContent='Aperçu 3D indisponible sur ce navigateur — activer WebGL';canvas.hidden=true;}
if(renderer){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,80);
 camera.position.set(4.2,-7.5,3.9);camera.lookAt(0,0,1);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.65;
 const light=new THREE.HemisphereLight(0xe6f4ff,0x4f2819,2.6);scene.add(light);
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(2,-6,8);scene.add(key);
 const rim=new THREE.DirectionalLight(0xff9866,3.4);rim.position.set(-5,2,5);scene.add(rim);
 let sculpture=null;
 new GLTFLoader().load('../../toolchain/studio-web-3d/web/public/assets/webpage-sculpture.glb', gltf=>{
  sculpture=gltf.scene;scene.add(sculpture);
  sculpture.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  if(gltf.animations.length){ const mixer=new THREE.AnimationMixer(sculpture); const action=mixer.clipAction(gltf.animations[0]);action.play();action.paused=true;window.__studioAnimation={mixer,clip:gltf.animations[0]};}
  status.textContent='MODÈLE 3D CHARGÉ — SURVOLEZ POUR TOURNER';
 },undefined,e=>{status.textContent='Modèle 3D manquant : vérifier la génération Blender';console.error(e)});
 const pointer={x:0,y:0};canvas.addEventListener('pointermove',e=>{
  const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2;
 });canvas.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
 let scroll=0;ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',scrub:true,onUpdate:s=>{scroll=s.progress}});
 ScrollTrigger.create({trigger:'.story',start:'top bottom',end:'bottom top',scrub:true,onUpdate:s=>{scroll=.5+s.progress*.5}});
 let palette='titanium';const buttons=[...document.querySelectorAll('[data-material]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  palette=button.dataset.material;
  buttons.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  if(sculpture)sculpture.traverse(obj=>{if(obj.isMesh && obj.material && obj.material.color && obj.name.includes('STRUCTURE')){
    obj.material=obj.material.clone();obj.material.color.set(palette==='copper'?0xb86842:palette==='ivory'?0xded2bf:0x9db4bd);
  }});
 }));
 const resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(Math.round(r.width),Math.round(r.height),false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};
 new ResizeObserver(resize).observe(canvas);resize();
 let last=performance.now();const clock=new THREE.Clock();
 function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.07);last=now;
  if(sculpture){
   const rotY=pointer.x*.16+(reduceMotion?0:scroll*.22);
   const rotX=-pointer.y*.12;
   sculpture.rotation.y+= (rotY-sculpture.rotation.y)*Math.min(1,dt*3.4);
   sculpture.rotation.x+=(rotX-sculpture.rotation.x)*Math.min(1,dt*3.4);
   sculpture.position.z=(reduceMotion?0:Math.sin(now*.00045)*.12);
   if(window.__studioAnimation && !reduceMotion){const a=window.__studioAnimation;a.mixer.setTime(scroll*a.clip.duration);}
  }
  renderer.render(scene,camera);
 }
 requestAnimationFrame(tick);
 document.addEventListener('visibilitychange',()=>{last=performance.now()});
}
if(!reduceMotion){
 gsap.from('.hero-copy>*',{opacity:0,y:45,stagger:.14,duration:1.3,ease:'power3.out'});
 gsap.utils.toArray('.story h2, .end h2').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 82%',toggleActions:'play none none reverse'},opacity:0,y:120,rotateX:14,duration:1.1,ease:'power3.out'}));
}
