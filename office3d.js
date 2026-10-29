/* MagentaLingo · 3D-Büro
   Ein begehbares Büro: Empfang, Flur und acht Räume. Tilly läuft per Tippen auf den Boden, per Raum-Leiste oder mit WASD/Pfeiltasten.
   Jedes Tool aus LEARN steht als Objekt im Raum (die Büro-Analogie), ein Punkt darüber öffnet die Infokarte.
   Wird nur im Bereich „Wissen“ geladen (import()), die App selbst bleibt ohne 3D lauffähig. */
import * as THREE from './vendor/three/three.module.min.js';
import {RoundedBoxGeometry} from './vendor/three/RoundedBoxGeometry.js';

export function supported(){
  try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')));}catch(e){return false;}
}

/* ---------- Grundriss (Meter) ----------
   Empfang x -10…2, z -6…6, Eingang im Westen. Flur x 2…34, z -2…2.
   Nordseite (Sicherheit): it, post, vault, soc. Südseite (Arbeiten & KI): desk, meet, hub, ai. Räume 8 × 8 m. */
const NORTH=['it','post','vault','soc'],SOUTH=['desk','meet','hub','ai'];
const ROOMS={};
NORTH.forEach((id,i)=>ROOMS[id]={id,cx:6+i*8,cz:-6,rot:0,side:-1});
SOUTH.forEach((id,i)=>ROOMS[id]={id,cx:6+i*8,cz:6,rot:Math.PI,side:1});
ROOMS.door={id:'door',cx:-4,cz:0,rot:-Math.PI/2,side:0};
const WALL_H=1.3,WALL_T=0.22,R=0.32,SPEED=4.2;

/* Kurznamen für die Punkte im Raum */
const SHORT={entra:'Entra ID',mfa:'MFA',ca:'Bedingter Zugriff',idp:'Identity Protection',pim:'PIM',intune:'Intune',autopilot:'Autopilot',defender:'Defender',
  eop:'Mailfilter',mdo:'Defender for Office',labels:'Vertraulichkeit',dlp:'DLP',retention:'Aufbewahrung',xdr:'Defender XDR',sentinel:'Sentinel',seccop:'Security Copilot',
  apps:'Office-Apps',outlook:'Outlook',onedrive:'OneDrive',planner:'Planner & Loop',teams:'Teams',rooms:'Teams Rooms',tpremium:'Teams Premium',phone:'Teams Phone',
  sharepoint:'SharePoint',viva:'Viva Connections',cchat:'Copilot Chat',copilot:'M365 Copilot',agents:'Agents',researcher:'Researcher'};

export function mount(root,api){
  const reduced=api.reduced();
  const dark=(()=>{const c=getComputedStyle(document.body).backgroundColor.match(/\d+/g);return c?(+c[0]*.3+ +c[1]*.59+ +c[2]*.11)<110:false;})();
  const P=dark?{bg:'#15101F',ground:'#1F3326',hall:'#3A3156',lobby:'#5E4532',sec:'#27503F',mw:'#323A6E',ai:'#41305F',wall:'#5E5480',cap:'#7D70A0',line:'#FF3FA4',runner:'#5A2547'}
              :{bg:'#E9F1E4',ground:'#BFDDB0',hall:'#EAE4F4',lobby:'#E9CFAF',sec:'#CDEBD8',mw:'#D6DBF8',ai:'#E4D4FA',wall:'#FFFFFF',cap:'#BDB2D6',line:'#E20074',runner:'#F3C6DD'};
  const TH={sec:dark?'#68CF97':'#23804E',mw:dark?'#9EA1F2':'#5B5FC7',ai:dark?'#B597F5':'#7A45D6'};
  const zoneTh=z=>z.th[0];
  const zones=api.zones,zoneById=Object.fromEntries(zones.map(z=>[z.id,z]));
  const tools=zones.flatMap(z=>z.tools.map(t=>({...t,zone:z.id})));
  const toolById=Object.fromEntries(tools.map(t=>[t.id,t]));

  /* ---------- DOM ---------- */
  root.innerHTML=`<canvas aria-hidden="true"></canvas>
    <div class="otop"><div class="oroom" id="oRoom" role="status" aria-live="polite"></div>
      <div class="obtns"><button class="obtn" data-o="left" aria-label="Ansicht nach links drehen">⟲</button><button class="obtn" data-o="right" aria-label="Ansicht nach rechts drehen">⟳</button>
      <button class="obtn" data-o="in" aria-label="Näher heran">+</button><button class="obtn" data-o="out" aria-label="Weiter weg">−</button>
      <button class="obtn" data-o="max" aria-label="Vollbild">⛶</button></div></div>
    <div class="ohs-layer" id="oHs"></div>
    <div class="ochips" id="oChips" role="group" aria-label="Räume"></div>
    <div class="ocard" id="oCard" role="dialog" aria-modal="false" aria-label="Tool-Info" hidden></div>
    <div class="ohint" id="oHint" hidden><b>Willkommen im digitalen Büro!</b><span>Tippe auf den Boden, um Tilly laufen zu lassen. Die leuchtenden Punkte zeigen die Tools im Raum. Ziehen dreht die Ansicht, unten springst du direkt in einen Raum.</span><button class="btn small" id="oHintOk">Los geht’s</button></div>`;
  const canvas=root.querySelector('canvas'),$o=id=>root.querySelector('#'+id);
  const elRoom=$o('oRoom'),elHs=$o('oHs'),elChips=$o('oChips'),elCard=$o('oCard'),elHint=$o('oHint');
  root.tabIndex=0;

  /* ---------- Renderer, Szene, Licht ---------- */
  const mobile=matchMedia('(pointer:coarse)').matches;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.75:2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=dark?1.15:1.0;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(P.bg);scene.fog=new THREE.Fog(P.bg,45,95);
  const camera=new THREE.PerspectiveCamera(42,1,0.1,200);
  scene.add(new THREE.HemisphereLight(dark?'#B9A8E8':'#FFFFFF',dark?'#2A2140':'#A99BC8',dark?1.05:0.95));
  const sun=new THREE.DirectionalLight(dark?'#E8DFFF':'#FFF1E0',dark?1.7:2.5);
  sun.position.set(22,26,18);sun.target.position.set(10,0,0);sun.castShadow=true;
  sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);
  Object.assign(sun.shadow.camera,{left:-28,right:28,top:20,bottom:-20,near:1,far:80});sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.03;
  scene.add(sun,sun.target);

  /* ---------- Bausteine ---------- */
  const mats=new Map(),geos=new Map(),texs=[];
  const mat=(c,o={})=>{const k=c+JSON.stringify(o);if(!mats.has(k))mats.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.78,metalness:0,...o}));return mats.get(k);};
  const geo=(k,f)=>{if(!geos.has(k))geos.set(k,f());return geos.get(k);};
  const mesh=(g,m,shadow=true)=>{const x=new THREE.Mesh(g,m);x.castShadow=shadow;x.receiveShadow=true;return x;};
  const rb=(w,h,d,c,r,o)=>{r=r??Math.min(.07,w/3,h/3,d/3);return mesh(geo(`rb${w},${h},${d},${r}`,()=>new RoundedBoxGeometry(w,h,d,3,r)),mat(c,o));};
  const cyl=(rt,rb_,h,c,seg=24,o)=>mesh(geo(`cy${rt},${rb_},${h},${seg}`,()=>new THREE.CylinderGeometry(rt,rb_,h,seg)),mat(c,o));
  const sph=(r,c,o)=>mesh(geo(`sp${r}`,()=>new THREE.SphereGeometry(r,24,16)),mat(c,o));
  const cap=(r,l,c)=>mesh(geo(`ca${r},${l}`,()=>new THREE.CapsuleGeometry(r,l,6,14)),mat(c));
  const put=(o,x,y,z,ry=0,parent)=>{o.position.set(x,y,z);o.rotation.y=ry;if(parent)parent.add(o);return o;};
  const glow=(c,i=1.2)=>({emissive:c,emissiveIntensity:i});
  /* Bildschirme und Schilder als Canvas-Texturen */
  function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;texs.push(t);t.userData.redraw=()=>{g.clearRect(0,0,w,h);draw(g,w,h);t.needsUpdate=true;};return t;}
  const rr=(g,x,y,w,h,r)=>{g.beginPath();g.roundRect(x,y,w,h,r);};
  function screen(kind,seed=0){
    return tex(256,160,(g,w,h)=>{
      const bgDark=['gear','dash','xray','radar','faces','chat2'].includes(kind);
      g.fillStyle=bgDark?'#1C1630':'#FFFFFF';g.fillRect(0,0,w,h);
      const C=['#E20074','#6D4DFF','#18B4E8','#14A35A','#FFB400','#FF6A13'];
      if(kind==='doc'){g.fillStyle='#2B579A';g.fillRect(0,0,w,22);g.fillStyle='#C9CFDB';for(let i=0;i<7;i++)g.fillRect(24,40+i*15,i%3===2?120:200,7);}
      if(kind==='sheet'){g.fillStyle='#217346';g.fillRect(0,0,w,22);g.strokeStyle='#D5DCE6';for(let x=0;x<w;x+=36){g.beginPath();g.moveTo(x,22);g.lineTo(x,h);g.stroke();}for(let y=22;y<h;y+=17){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}g.fillStyle='#217346';[40,70,55,95,80].forEach((v,i)=>g.fillRect(150+i*18,h-8-v,12,v));}
      if(kind==='slide'){g.fillStyle='#C43E1C';g.fillRect(0,0,w,22);g.fillStyle='#1A1430';g.font='bold 22px sans-serif';g.fillText('Q3 Ergebnis',22,58);[60,90,50,110].forEach((v,i)=>{g.fillStyle=C[i];g.fillRect(30+i*48,h-14-v*.7,34,v*.7);});}
      if(kind==='gear'){g.strokeStyle='#8F78FF';g.lineWidth=10;g.beginPath();g.arc(w/2,h/2,38,0,7);g.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;g.fillStyle='#8F78FF';g.fillRect(w/2+Math.cos(a)*48-7,h/2+Math.sin(a)*48-7,14,14);}g.strokeStyle='#34C477';g.lineWidth=9;g.beginPath();g.moveTo(w/2-16,h/2);g.lineTo(w/2-4,h/2+13);g.lineTo(w/2+18,h/2-12);g.stroke();}
      if(kind==='dash'){g.fillStyle='#2A2142';for(let i=0;i<4;i++){rr(g,10+(i%2)*124,10+Math.floor(i/2)*74,114,66,8);g.fill();}g.lineWidth=3;
        for(let i=0;i<4;i++){const ox=16+(i%2)*124,oy=20+Math.floor(i/2)*74;g.strokeStyle=C[(i+seed)%6];g.beginPath();for(let k=0;k<8;k++){const y=oy+44-((Math.sin(k*1.3+i+seed)+1)*18);k?g.lineTo(ox+k*14,y):g.moveTo(ox,y);}g.stroke();}
        if(seed%3===0){g.fillStyle='#FF5C60';rr(g,150,96,70,18,9);g.fill();g.fillStyle='#fff';g.font='bold 12px sans-serif';g.fillText('Vorfall',162,109);}}
      if(kind==='faces'){const cols=['#F0BE9A','#C68B62','#8D5B3E','#F5D0B5','#E0A980','#A46C4B'];for(let i=0;i<6;i++){const x=6+(i%3)*83,y=6+Math.floor(i/3)*76;g.fillStyle='#2E2648';rr(g,x,y,78,70,8);g.fill();g.fillStyle=C[i];g.beginPath();g.arc(x+39,y+68,24,Math.PI,0);g.fill();g.fillStyle=cols[i];g.beginPath();g.arc(x+39,y+30,15,0,7);g.fill();}}
      if(kind==='chat'||kind==='chat2'){[[16,18,150,'#ECEDFC'],[90,62,150,'#E20074'],[16,106,120,'#ECEDFC']].forEach(([x,y,bw,c])=>{g.fillStyle=c;rr(g,x,y,bw,34,14);g.fill();g.fillStyle=c==='#E20074'?'#fff':'#9AA0B4';g.fillRect(x+14,y+12,bw-40,5);g.fillRect(x+14,y+21,bw-70,5);});}
      if(kind==='news'){g.fillStyle='#E20074';g.fillRect(0,0,w,26);g.fillStyle='#fff';g.font='bold 15px sans-serif';g.fillText('News',12,18);[['#6D4DFF',8,34,118,64],['#18B4E8',132,34,116,64],['#FFB400',8,104,240,48]].forEach(([c,x,y,bw,bh])=>{g.fillStyle=c;rr(g,x,y,bw,bh,8);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(x+10,y+bh-18,bw*.55,6);});}
      if(kind==='xray'){g.fillStyle='#0E2A4A';g.fillRect(0,0,w,h);g.strokeStyle='#62B0F4';g.lineWidth=4;g.strokeRect(70,40,116,80);g.strokeRect(84,54,40,30);g.fillStyle='#FF5C60';g.beginPath();g.arc(160,96,12,0,7);g.fill();g.fillStyle='#FF5C60';g.font='bold 14px sans-serif';g.fillText('verdächtig',150,130);}
      if(kind==='cal'){g.fillStyle='#0F6CBD';g.fillRect(0,0,w,24);g.fillStyle='#fff';g.font='bold 15px sans-serif';g.fillText('Kalender',10,17);g.strokeStyle='#D5DCE6';for(let x=0;x<=5;x++){g.beginPath();g.moveTo(8+x*48,28);g.lineTo(8+x*48,h-6);g.stroke();}
        [[0,40,'#E20074'],[1,70,'#14A35A'],[2,46,'#6D4DFF'],[3,96,'#FFB400'],[4,60,'#18B4E8'],[1,110,'#FF6A13']].forEach(([d,y,c])=>{g.fillStyle=c;rr(g,11+d*48,y,42,22,5);g.fill();});}
      if(kind==='kanban'){g.fillStyle='#F7F3E8';g.fillRect(0,0,w,h);['Offen','Läuft','Fertig'].forEach((n,i)=>{g.fillStyle='#6A6386';g.font='bold 13px sans-serif';g.fillText(n,12+i*84,18);});
        [[0,0,'#FFE27A'],[0,1,'#9EE0FF'],[0,2,'#FFB3D9'],[1,0,'#B7F0C9'],[1,1,'#FFE27A'],[2,0,'#C9B8FF'],[2,1,'#B7F0C9'],[2,2,'#9EE0FF']].forEach(([c,r,col])=>{g.fillStyle=col;g.fillRect(10+c*84,28+r*42,70,34);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(18+c*84,40+r*42,44,4);});}
      if(kind==='radar'){g.fillStyle='#0E2A22';g.fillRect(0,0,w,h);}
      if(kind==='stamp'){g.fillStyle='#E5383B';g.fillRect(0,0,w,h);g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(14,40,228,80);g.fillStyle='#fff';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText('VERTRAULICH',128,92);}
    });
  }
  const screenMesh=(w,h,kind,seed)=>{const m=new THREE.Mesh(geo(`pl${w},${h}`,()=>new THREE.PlaneGeometry(w,h)),new THREE.MeshBasicMaterial({map:screen(kind,seed),toneMapped:false}));return m;};
  function monitor(kind,seed){const g=new THREE.Group();put(rb(.62,.4,.05,'#22202E'),0,.36,0,0,g);const s=put(screenMesh(.56,.34,kind,seed),0,.36,.027,0,g);put(cyl(.025,.025,.18,'#22202E'),0,.09,-.02,0,g);put(rb(.22,.02,.14,'#22202E'),0,.01,-.02,0,g);return g;}
  function laptop(kind){const g=new THREE.Group();put(rb(.46,.025,.32,'#C9CDD8'),0,.012,0,0,g);const lid=new THREE.Group();put(rb(.46,.3,.02,'#C9CDD8'),0,.15,0,0,lid);put(screenMesh(.42,.26,kind),0,.15,.012,0,lid);lid.position.set(0,.02,-.15);lid.rotation.x=-.25;g.add(lid);return g;}
  function plant(s=1){const g=new THREE.Group();put(cyl(.2*s,.16*s,.36*s,'#E9E2D4'),0,.18*s,0,0,g);[[0,.62,0,.24],[.12,.52,.08,.18],[-.12,.5,-.06,.17],[.04,.78,-.05,.16]].forEach(([x,y,z,r])=>put(sph(r*s,'#3FA66B'),x*s,y*s,z*s,0,g));return g;}
  function chair(c='#3B3552'){const g=new THREE.Group();put(rb(.44,.07,.44,c),0,.46,0,0,g);put(rb(.44,.46,.07,c),0,.72,-.2,0,g);put(cyl(.03,.03,.4,'#77738A'),0,.23,0,0,g);put(cyl(.2,.2,.03,'#77738A'),0,.03,0,0,g);return g;}
  function desk(w=1.4,d=.75,c='#E8DCCB'){const g=new THREE.Group();put(rb(w,.05,d,c),0,.74,0,0,g);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>put(rb(.05,.72,.05,'#8C8899'),a*(w/2-.06),.36,b*(d/2-.06),0,g));return g;}
  function box(w,h,d,c='#D9B38C'){const g=new THREE.Group();put(rb(w,h,d,c,.02),0,h/2,0,0,g);put(rb(w*1.002,.02,.06,'#B98E62',.005),0,h+.002,0,0,g);return g;}
  function person({shirt,pants='#2F2A40',skin='#F0BE9A',hair=null,capc=null,glasses=false,item=null}){
    const g=new THREE.Group(),legs=[],arms=[];
    [-.1,.1].forEach(x=>{const p=new THREE.Group();put(cap(.085,.42,pants),0,-.3,0,0,p);put(rb(.14,.08,.24,'#2A2438',.03),0,-.6,.04,0,p);p.position.set(x,.66,0);g.add(p);legs.push(p);});
    put(cap(.22,.34,shirt),0,1.0,0,0,g);
    [-.29,.29].forEach(x=>{const p=new THREE.Group();put(cap(.07,.36,shirt),0,-.22,0,0,p);put(sph(.075,skin),0,-.46,0,0,p);p.position.set(x,1.22,0);p.rotation.z=x>0?-.08:.08;g.add(p);arms.push(p);});
    const head=new THREE.Group();head.position.y=1.54;g.add(head);
    put(sph(.25,skin),0,0,0,0,head);[-.25,.25].forEach(x=>put(sph(.06,skin),x,-.01,0,0,head));
    put(sph(.028,'#2B1D16'),-.085,.02,.225,0,head);put(sph(.028,'#2B1D16'),.085,.02,.225,0,head);
    const sm=new THREE.Mesh(geo('smile',()=>new THREE.TorusGeometry(.07,.014,8,16,Math.PI)),mat('#8A3340'));sm.position.set(0,-.08,.225);sm.rotation.z=Math.PI;head.add(sm);
    if(glasses){[-.095,.095].forEach(x=>{const f=new THREE.Mesh(geo('glass',()=>new THREE.TorusGeometry(.062,.016,8,4)),mat('#15111A'));f.rotation.z=Math.PI/4;f.scale.set(1.15,.85,1);f.position.set(x,.025,.235);head.add(f);});put(rb(.06,.016,.016,'#15111A',.005),0,.035,.24,0,head);}
    if(hair){const h=mesh(geo('hair',()=>new THREE.SphereGeometry(.265,24,12,0,Math.PI*2,0,Math.PI/2.2)),mat(hair));h.position.y=.02;h.rotation.x=-.25;head.add(h);}
    if(capc){put(cyl(.25,.26,.12,capc),0,.2,0,0,head);put(rb(.3,.025,.2,capc,.01),0,.15,.2,0,head);}
    if(item==='clip'){const c=put(rb(.22,.3,.02,'#C99A6B',.01),.1,-.12,.12,0,arms[1]);c.rotation.x=-.6;put(rb(.16,.2,.005,'#FFFFFF',.002),.1,-.12,.135,0,arms[1]).rotation.x=-.6;arms[1].rotation.x=-.7;}
    if(item==='shield'){const s=put(cyl(.1,.1,.02,'#FFB400',6,glow('#FFB400',.3)),0,1.12,.22,0,g);s.rotation.x=Math.PI/2;}
    return {g,legs,arms,head};
  }
  /* Ein Tool-Objekt: Gruppe im Raum, Punkt darüber, Standplatz davor */
  const toolObj={};const solids=[];const animated=[];
  function tool(id,room,obj,{x,z,ry=0,hy=1.9,stand,via}){
    put(obj,x,0,z,ry,room.g);obj.traverse(m=>{if(m.isMesh)m.userData.tool=id;});
    toolObj[id]={obj,room,anchor:new THREE.Vector3(x,hy,z),stand:stand||[x,z+1.3],via:via||[],look:[x,z]};
  }
  const solid=o=>{solids.push(o);return o;};

  /* ---------- Boden, Wände ---------- */
  const walls=[];
  const ground=mesh(new THREE.PlaneGeometry(160,120),mat(P.ground),false);ground.rotation.x=-Math.PI/2;ground.position.set(12,-.02,0);scene.add(ground);
  /* Bodenmuster: Holz im Empfang, Fliesen in den Räumen, Teppich im Flur */
  const pattern=(kind,c)=>{const t=tex(256,256,(g,w,h)=>{g.fillStyle=c;g.fillRect(0,0,w,h);const sh=new THREE.Color(c);sh.offsetHSL(0,0,dark?.05:-.06);g.strokeStyle='#'+sh.getHexString();
      if(kind==='wood'){g.lineWidth=3;for(let y=0;y<=h;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}for(let y=0;y<h;y+=32){const o=(y/32)%2?64:0;for(let x=o;x<w;x+=128){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+32);g.stroke();}}}
      else if(kind==='tile'){g.lineWidth=4;for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}}
      else{g.lineWidth=2;for(let i=0;i<w;i+=8){g.globalAlpha=.25;g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();}g.globalAlpha=1;}});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;};
  function floor(x1,x2,z1,z2,c,kind='tile',scale=2){const w=x2-x1,d=z2-z1;const m=new THREE.MeshStandardMaterial({color:'#FFFFFF',roughness:.85,map:pattern(kind,c)});m.map.repeat.set(w/scale,d/scale);mats.set('floor'+x1+z1,m);
    const f=new THREE.Mesh(new THREE.BoxGeometry(w,.1,d),m);f.receiveShadow=true;geos.set('floorg'+x1+z1,f.geometry);put(f,(x1+x2)/2,-.05,(z1+z2)/2,0,scene);}
  floor(-10,2,-6,6,P.lobby,'wood',3);floor(2,34,-2,2,P.hall,'tile',2);
  {const ru=new THREE.Mesh(new THREE.BoxGeometry(31,.02,1.8),new THREE.MeshStandardMaterial({color:'#FFFFFF',roughness:1,map:pattern('carpet',P.runner)}));ru.material.map.repeat.set(12,1);ru.receiveShadow=true;put(ru,18.5,.005,0,0,scene);mats.set('runner',ru.material);geos.set('runnerg',ru.geometry);}
  zones.forEach(z=>{if(z.id==='door')return;const r=ROOMS[z.id];floor(r.cx-4,r.cx+4,r.cz-4,r.cz+4,P[zoneTh(z)]);});
  /* Leitlinie im Flur */
  [-.95,.95].forEach(z=>{const line=rb(30.6,.02,.06,P.line,.01,glow(P.line,.35));line.castShadow=false;put(line,18.5,.02,z,0,scene);});
  function wall(x1,z1,x2,z2){const w=Math.abs(x2-x1)||WALL_T,d=Math.abs(z2-z1)||WALL_T,cx=(x1+x2)/2,cz=(z1+z2)/2;
    put(rb(w+(x1!==x2?WALL_T:0),WALL_H,d+(z1!==z2?WALL_T:0),P.wall,.05),cx,WALL_H/2,cz,0,scene);
    const c=rb(w+(x1!==x2?WALL_T:0)+.02,.06,d+(z1!==z2?WALL_T:0)+.02,P.cap,.02);c.castShadow=false;put(c,cx,WALL_H+.02,cz,0,scene);
    walls.push([Math.min(x1,x2)-WALL_T/2,Math.max(x1,x2)+WALL_T/2,Math.min(z1,z2)-WALL_T/2,Math.max(z1,z2)+WALL_T/2]);}
  function wallGaps(fixed,axis,a,b,gaps){let s=a;gaps.sort((p,q)=>p-q).forEach(g=>{if(g-1>s)axis==='x'?wall(s,fixed,g-1,fixed):wall(fixed,s,fixed,g-1);s=g+1;});if(s<b)axis==='x'?wall(s,fixed,b,fixed):wall(fixed,s,fixed,b);}
  wall(2,-10,34,-10);wall(2,10,34,10);wall(34,-10,34,10);wall(-10,-6,2,-6);wall(-10,6,2,6);
  wallGaps(-10,'z',-6,6,[0]);wallGaps(2,'z',-10,10,[-1,0,1].map(v=>v));
  [10,18,26].forEach(x=>{wall(x,-10,x,-2);wall(x,2,x,10);});
  wallGaps(-2,'x',2,34,[6,14,22,30]);wallGaps(2,'x',2,34,[6,14,22,30]);
  /* Türrahmen in Raumfarbe */
  zones.forEach(z=>{if(z.id==='door')return;const r=ROOMS[z.id],c=TH[zoneTh(z)];[-1.05,1.05].forEach(dx=>put(rb(.16,1.6,.3,c,.04),r.cx+dx,.8,r.side*2,0,scene));});
  /* Außen: Bäume und Weg zum Eingang */
  [[-15,-5],[-16,4.5],[-13,9],[-14,-9.5],[38,-6],[37.5,5],[8,13],[24,13.5],[16,-13.5],[30,-13]].forEach(([x,z],i)=>{const t=new THREE.Group();put(cyl(.12,.16,1,'#8A6243'),0,.5,0,0,t);put(mesh(geo('cone',()=>new THREE.ConeGeometry(.9,2,12)),mat(i%2?'#3FA66B':'#2E8C59')),0,1.9,0,0,t);put(t,x,0,z,0,scene);});
  for(let i=0;i<4;i++){const s=rb(1.2,.04,.8,dark?'#3A3350':'#D3CBE3',.04);s.castShadow=false;put(s,-11-i*1.5,0,0,0,scene);}
  const mat_=rb(1.2,.03,2.0,'#C0006A',.03);mat_.castShadow=false;put(mat_,-9.3,.02,0,0,scene);

  /* ---------- Räume mit Inhalt ---------- */
  Object.values(ROOMS).forEach(r=>{r.g=new THREE.Group();r.g.position.set(r.cx,0,r.cz);r.g.rotation.y=r.rot;scene.add(r.g);});
  const C={sec:TH.sec,mw:TH.mw,ai:TH.ai};
  { /* Empfang: lokales +z zeigt zum Eingang */
    const g=ROOMS.door.g;
    const gate=new THREE.Group();[-.95,.95].forEach(x=>{solids.push(put(rb(.22,1.05,.7,'#C4C9D6',.05),x,.52,0,0,gate));const fl=put(rb(.04,.6,.5,'#9FD3F5',.02,{transparent:true,opacity:.55}),x+(x<0?.3:-.3),.7,0,0,gate);fl.rotation.y=Math.PI/2;});
    const reader=put(rb(.16,.22,.06,'#1C1630',.02),.95,1.18,.36,0,gate);put(rb(.1,.06,.008,'#34C477',.01,glow('#34C477',1.3)),.95,1.24,.395,0,gate);
    for(let i=0;i<3;i++)for(let k=0;k<3;k++)put(rb(.025,.025,.008,'#8F78FF',.004,glow('#8F78FF',.8)),.92+i*.03,1.12-k*.03,.395,0,gate);
    tool('mfa',ROOMS.door,gate,{x:0,z:3.2,hy:1.7,stand:[1.6,4.4]});
    const booth=new THREE.Group();put(rb(1.5,1.1,1.2,'#FFFFFF'),0,.55,0,0,booth);put(rb(1.56,.08,1.26,C.sec),0,1.12,0,0,booth);put(rb(1.3,.5,.04,'#9FD3F5',.02,{transparent:true,opacity:.5}),0,1.45,.6,0,booth);put(rb(1.56,.08,1.26,C.sec),0,1.75,0,0,booth);
    [[-.73,.58],[.73,.58]].forEach(([x,z])=>put(rb(.06,.65,.06,'#FFFFFF'),x,1.45,z,0,booth));
    const guard=person({shirt:'#2D3A64',capc:'#1E2A4A',item:'clip'});put(guard.g,0,0,1.0,0,booth);
    const sign=put(screenMesh(.5,.32,'chat'),.95,1.25,.62,-.3,booth);
    solid(booth);tool('ca',ROOMS.door,booth,{x:-3.4,z:2.6,hy:2.4,stand:[-1.5,4.2]});
    const pole=new THREE.Group();put(cyl(.05,.07,2.5,'#77738A'),0,1.25,0,0,pole);const cam=put(rb(.42,.2,.22,'#FFFFFF',.06),0,2.52,.12,0,pole);cam.rotation.x=.35;put(cyl(.07,.07,.06,'#1C1630',16),0,2.48,.25,0,pole).rotation.x=Math.PI/2+.35;
    const camLed=put(sph(.03,'#FF5C60',glow('#FF5C60',2)),.14,2.6,.22,0,pole);animated.push(t=>{camLed.visible=Math.sin(t*4)>0;});
    pole.userData.spin=cam;tool('idp',ROOMS.door,pole,{x:3.4,z:4.7,ry:Math.PI+.4,hy:3.0,stand:[2.4,3.6]});
    const rec=new THREE.Group();put(rb(2.8,1.0,.8,'#FFFFFF',.12),0,.5,0,0,rec);put(rb(2.9,.06,.9,'#E8DCCB',.03),0,1.03,0,0,rec);put(rb(2.82,.14,.02,C.sec),0,.7,.41,0,rec);
    const pr=put(rb(.36,.18,.3,'#3B3552',.04),.8,1.15,0,0,rec);put(rb(.16,.005,.1,'#E20074'),.8,1.25,.08,0,rec);
    [0,1,2].forEach(i=>put(rb(.09,.13,.01,['#E20074','#6D4DFF','#14A35A'][i],.01),-.6+i*.15,1.13,.2,0,rec).rotation.x=-1.2);
    put(monitor('doc'),-.2,1.06,-.15,0,rec);const recep=person({shirt:'#7A45D6',hair:'#3B2A20',skin:'#C68B62'});put(recep.g,0,0,-.85,0,rec);
    solid(rec);tool('entra',ROOMS.door,rec,{x:3.0,z:-1.4,hy:2.4,stand:[3.0,0.3]});
    const kc=new THREE.Group();put(rb(.9,1.2,.3,'#3B3552'),0,.95,0,0,kc);put(rb(.84,1.14,.02,'#4A4162'),0,.95,.16,0,kc);
    for(let i=0;i<3;i++)for(let k=0;k<2;k++)put(cyl(.015,.015,.12,'#B8BFCC',8),-.25+i*.25,1.25-k*.4,.2,0,kc).rotation.x=Math.PI/2;
    const key=new THREE.Group();put(mesh(geo('ring',()=>new THREE.TorusGeometry(.08,.025,8,16)),mat('#FFB400',{metalness:.6,roughness:.3,...glow('#FFB400',.35)})),0,0,0,0,key);put(rb(.22,.04,.03,'#FFB400',.01,{metalness:.6,roughness:.3}),.15,0,0,0,key);key.position.set(0,1.95,.15);kc.add(key);
    animated.push(t=>{key.rotation.y=t*1.2;key.position.y=1.95+Math.sin(t*2)*.04;});
    solid(kc);tool('pim',ROOMS.door,kc,{x:-5.7,z:-2.2,ry:Math.PI/2,hy:2.4,stand:[-4.4,-2.2]});
    const sofa=new THREE.Group();put(rb(2.0,.42,.8,'#E20074',.12),0,.21,0,0,sofa);put(rb(2.0,.55,.22,'#C0006A',.1),0,.55,-.32,0,sofa);put(sofa,-3.4,0,-4.9,0,g);solid(sofa);
    put(rb(.9,.4,.6,'#E8DCCB'),-3.4,.2,-3.8,0,g);put(plant(1.2),-5.4,0,-5.3,0,g);put(plant(1.1),5.3,0,5.2,0,g);put(plant(1),-5.3,0,5.2,0,g);
  }
  function room(id,build){const r=ROOMS[id];build(r.g,r);}
  room('it',(g,r)=>{
    const wb=new THREE.Group();put(rb(4.2,.08,.9,'#C99A6B'),0,.86,0,0,wb);[-1.95,1.95].forEach(x=>put(rb(.1,.82,.8,'#77738A'),x,.41,0,0,wb));put(rb(4.2,.9,.04,'#5A536F'),0,1.35,-.43,0,wb);
    [-1.3,0,1.3].forEach((x,i)=>put(laptop('gear'),x,.9,.05,0,wb));[[-.6,'#2A2438'],[.65,'#2A2438']].forEach(([x,c])=>{const p=put(rb(.1,.012,.2,c,.008),x,.91,.2,0,wb);p.rotation.y=.3;});
    for(let i=0;i<6;i++)put(rb(.09,.16,.01,'#9FD3F5',.01,glow('#9FD3F5',.25)),-1.7+i*.68,1.45,-.41,0,wb);
    solid(wb);tool('intune',r,wb,{x:0,z:-3.3,hy:2.1,stand:[0,-1.9]});
    const ap=new THREE.Group();put(rb(1.1,.12,.7,'#77738A'),0,.25,0,0,ap);[[-.4,-.25],[.4,-.25],[-.4,.25],[.4,.25]].forEach(([x,z])=>put(sph(.06,'#2A2438'),x,.07,z,0,ap));
    put(box(.9,.32,.56),0,.31,0,0,ap);put(box(.8,.3,.5),0,.64,0,.1,ap);const open=put(box(.7,.22,.46,'#E3C29E'),0,.95,0,-.08,ap);put(laptop('doc'),0,1.2,.02,0,ap);
    solid(ap);tool('autopilot',r,ap,{x:-2.6,z:.4,hy:2.0,stand:[-2.6,1.8]});
    const df=new THREE.Group();const gd=person({shirt:'#263238',capc:'#1C1630',item:'shield'});put(gd.g,0,0,0,0,df);
    const bc=put(new THREE.Group(),.75,0,.1,0,df);put(cyl(.05,.05,1.1,'#77738A'),0,.55,0,0,bc);const lamp=put(cyl(.13,.13,.2,'#FF5C60',16,{...glow('#FF5C60',1.5),transparent:true,opacity:.9}),0,1.2,0,0,bc);
    const beam=put(rb(.04,.04,.5,'#FF5C60',.01,glow('#FF5C60',2)),0,1.2,0,0,bc);animated.push(t=>{beam.rotation.y=t*4;lamp.material.emissiveIntensity=1+Math.sin(t*8)*.6;});
    solid(df);tool('defender',r,df,{x:2.3,z:.3,hy:2.3,stand:[2.3,1.8]});
    const rack=new THREE.Group();put(rb(.7,2.0,.7,'#2A2438'),0,1.0,0,0,rack);for(let i=0;i<7;i++){put(rb(.6,.18,.02,'#3B3552',.01),0,.25+i*.25,.355,0,rack);put(sph(.018,i%3?'#34C477':'#18B4E8',glow(i%3?'#34C477':'#18B4E8',2)),.22,.25+i*.25,.37,0,rack);}
    put(solid(rack),3.3,0,-3.3,0,g);put(plant(),-3.4,0,-3.4,0,g);
  });
  room('post',(g,r)=>{
    const sh=new THREE.Group();put(rb(3.6,1.9,.5,'#E8DCCB'),0,.95,-.02,0,sh);
    for(let i=0;i<6;i++)for(let k=0;k<4;k++){put(rb(.54,.38,.46,'#D2C3AE',.02),-1.5+i*.6,.32+k*.44,.04,0,sh);if((i+k)%2===0)put(rb(.36,.22,.02,['#FFFFFF','#FFE27A','#9EE0FF','#FFB3D9'][(i*k)%4],.01),-1.5+i*.6,.32+k*.44,.27,0,sh);}
    solid(sh);tool('eop',r,sh,{x:0,z:-3.5,hy:2.4,stand:[0,-2.1]});
    const bin=new THREE.Group();put(cyl(.3,.24,.65,'#E5383B'),0,.33,0,0,bin);[[0,.7,0],[.12,.72,.08],[-.1,.71,-.05]].forEach(([x,y,z])=>put(mesh(geo('crumple',()=>new THREE.IcosahedronGeometry(.11,0)),mat('#FFE3E3')),x,y,z,0,bin));put(solid(bin),2.4,0,-2.6,0,g);
    const sc=new THREE.Group();put(rb(3.2,.12,.75,'#3B3552'),0,.72,0,0,sc);[-1.4,1.4].forEach(x=>put(rb(.12,.7,.65,'#77738A'),x,.35,0,0,sc));
    put(rb(1.1,1.0,.95,'#C4C9D6',.12),0,1.2,0,0,sc);put(rb(.8,.55,.06,'#1C1630',.04),0,1.05,.48,0,sc);put(rb(1.14,.1,.99,C.sec),0,1.62,0,0,sc);
    const mon=put(monitor('xray'),1.2,.78,-.3,-.3,sc);mon.scale.setScalar(1.2);
    const parcels=[0,1,2].map(i=>put(box(.36,.24,.34,i===1?'#E5C48F':'#D9B38C'),-1.4+i*1.1,.78,0,0,sc));
    animated.push(t=>{parcels.forEach((p,i)=>{p.position.x=((t*.45+i*1.07)%3.2)-1.6;});});
    solid(sc);tool('mdo',r,sc,{x:-.8,z:.6,hy:2.2,stand:[-.8,2.0]});
    const tr=new THREE.Group();put(rb(.9,.5,.6,'#0F6CBD',.06),0,.45,0,0,tr);[[-.35,-.25],[.35,-.25],[-.35,.25],[.35,.25]].forEach(([x,z])=>put(sph(.07,'#2A2438'),x,.07,z,0,tr));for(let i=0;i<4;i++)put(rb(.3,.02,.2,'#FFFFFF',.005),-.2+i*.12,.72,0,.2,tr);put(solid(tr),2.6,0,1.6,.4,g);
    const clerk=person({shirt:'#C25400',hair:'#6B4A2B'});put(clerk.g,1.8,0,-1.6,.5,g);
  });
  room('vault',(g,r)=>{
    const fc=new THREE.Group();put(rb(1.4,1.5,.62,'#B8BFCC',.04),0,.75,0,0,fc);for(let i=0;i<3;i++){put(rb(1.3,.42,.02,'#C9CFDB',.02),0,.3+i*.47,.31,0,fc);put(rb(.3,.04,.04,'#77738A',.01),0,.3+i*.47,.34,0,fc);}
    const fo=put(new THREE.Group(),0,1.52,.05,0,fc);put(rb(.62,.06,.44,'#E5383B',.02),0,0,0,0,fo);const st=put(screenMesh(.5,.3,'stamp'),0,.032,0,0,fo);st.rotation.x=-Math.PI/2;
    const lock=put(new THREE.Group(),.42,1.72,.05,0,fc);put(rb(.2,.18,.08,'#FFB400',.03,{metalness:.5,roughness:.35}),0,0,0,0,lock);put(mesh(geo('shackle',()=>new THREE.TorusGeometry(.065,.02,8,16,Math.PI)),mat('#B8BFCC',{metalness:.7,roughness:.3})),0,.09,0,0,lock);
    solid(fc);tool('labels',r,fc,{x:-2.6,z:-3.4,hy:2.3,stand:[-2.6,-2.0]});
    const ar=new THREE.Group();[-0.7,0.7].forEach(x=>{put(rb(1.3,2.0,.5,'#8C8899',.03),x,1.0,0,0,ar);for(let k=0;k<4;k++)for(let i=0;i<3;i++)put(box(.36,.3,.4,['#D9B38C','#C9A27A','#E3C29E'][(i+k)%3]),x-.42+i*.42,.12+k*.48,.03,0,ar);});
    const hg=put(new THREE.Group(),0,2.25,0,0,ar);put(cyl(.13,.13,.03,'#8A6243'),0,.3,0,0,hg);put(cyl(.13,.13,.03,'#8A6243'),0,-.3,0,0,hg);put(mesh(geo('hgl',()=>new THREE.CylinderGeometry(.11,.01,.28,16)),mat('#9FD3F5',{transparent:true,opacity:.6})),0,.14,0,0,hg);put(mesh(geo('hgl2',()=>new THREE.CylinderGeometry(.01,.11,.28,16)),mat('#9FD3F5',{transparent:true,opacity:.6})),0,-.14,0,0,hg);
    put(mesh(geo('sand',()=>new THREE.ConeGeometry(.08,.12,16)),mat('#FFB400')),0,-.22,0,0,hg);animated.push(t=>{hg.rotation.z=Math.floor(t/4)%2?Math.PI:0;});
    solid(ar);tool('retention',r,ar,{x:1.7,z:-3.4,hy:3.0,stand:[1.7,-2.0]});
    const gt=new THREE.Group();[-.8,.8].forEach(x=>put(rb(.2,2.1,.4,'#C4C9D6',.05),x,1.05,0,0,gt));put(rb(1.8,.2,.4,'#C4C9D6',.05),0,2.15,0,0,gt);
    const lp=put(rb(.36,.1,.12,'#34C477',.03,glow('#34C477',1.4)),0,2.28,.12,0,gt);animated.push(t=>{const bad=Math.sin(t*.9)>.55;lp.material.color.set(bad?'#FF5C60':'#34C477');lp.material.emissive.set(bad?'#FF5C60':'#34C477');});
        tool('dlp',r,gt,{x:0,z:2.5,hy:2.8,stand:[1.4,1.2]});
    const vd=new THREE.Group();put(cyl(1.0,1.0,.3,'#8C8899',32,{metalness:.5,roughness:.35}),0,0,0,0,vd).rotation.x=Math.PI/2;put(cyl(.7,.7,.32,'#A6ADBA',32,{metalness:.6,roughness:.3}),0,0,.02,0,vd).rotation.x=Math.PI/2;
    const wh=put(new THREE.Group(),0,0,.2,0,vd);for(let i=0;i<3;i++){const s=put(rb(.9,.06,.06,'#5A536F',.02),0,0,0,0,wh);s.rotation.z=i*Math.PI/3;}animated.push(t=>{wh.rotation.z=t*.4;});
    put(vd,3.75,1.15,.4,-Math.PI/2,g);
  });
  room('soc',(g,r)=>{
    const mw=new THREE.Group();put(rb(3.9,2.4,.2,'#2A2438'),0,1.4,-.05,0,mw);
    for(let i=0;i<3;i++)for(let k=0;k<2;k++)put(screenMesh(1.15,.68,'dash',i+k*3),-1.25+i*1.25,1.0+k*.76,.06,0,mw);
    const dk=put(new THREE.Group(),0,0,1.5,0,mw);put(desk(2.6,.8,'#3B3552'),0,0,0,0,dk);[-.8,0,.8].forEach((x,i)=>put(monitor('dash',i+2),x,.77,-.15,0,dk));
    const op=person({shirt:'#23804E',hair:'#1C1630'});put(op.g,.4,0,.85,Math.PI,dk);
    solid(mw);tool('xdr',r,mw,{x:0,z:-3.7,hy:3.0,stand:[2.7,-1.6]});
    const rd=new THREE.Group();put(cyl(.85,.75,.8,'#3B3552'),0,.4,0,0,rd);put(cyl(.8,.8,.04,'#0E2A22',48,glow('#14A35A',.25)),0,.82,0,0,rd);
    for(let i=1;i<4;i++){const ring=mesh(geo('rr'+i,()=>new THREE.TorusGeometry(i*.22,.008,6,48)),mat('#34C477',glow('#34C477',1.5)));ring.rotation.x=-Math.PI/2;ring.position.y=.85;rd.add(ring);}
    const sweep=put(new THREE.Group(),0,.86,0,0,rd);put(rb(.75,.012,.04,'#34C477',.004,glow('#34C477',2.5)),.375,0,0,0,sweep);
    const globe=put(mesh(geo('globe',()=>new THREE.IcosahedronGeometry(.32,1)),mat('#62B0F4',{wireframe:true,...glow('#62B0F4',1.2)}),false),0,1.55,0,0,rd);
    animated.push(t=>{sweep.rotation.y=-t*1.6;globe.rotation.y=t*.4;});
    solid(rd);tool('sentinel',r,rd,{x:2.5,z:1.0,hy:2.4,stand:[2.5,2.5]});
    const hc=new THREE.Group();put(cyl(.55,.6,.12,'#3B3552'),0,.06,0,0,hc);put(cyl(.5,.5,.02,'#B597F5',40,glow('#B597F5',1.4)),0,.13,0,0,hc);
    const holo=put(new THREE.Group(),0,1.2,0,0,hc);const hm=mat('#B597F5',{...glow('#8F78FF',1.6),transparent:true,opacity:.75});
    put(new THREE.Mesh(geo('star',()=>new THREE.OctahedronGeometry(.3,0)),hm),0,0,0,0,holo);put(new THREE.Mesh(geo('star2',()=>new THREE.OctahedronGeometry(.12,0)),hm),.42,.3,0,0,holo);put(new THREE.Mesh(geo('star2',()=>new THREE.OctahedronGeometry(.12,0)),hm),-.38,-.22,.1,0,holo);
    const sh=put(cyl(.16,.16,.02,'#68CF97',6,glow('#68CF97',1.2)),0,-.5,0,0,holo);sh.rotation.x=Math.PI/2;
    animated.push(t=>{holo.rotation.y=t*.8;holo.position.y=1.2+Math.sin(t*1.6)*.08;});
    tool('seccop',r,hc,{x:-2.5,z:.9,hy:2.3,stand:[-2.5,2.4]});
    put(plant(),3.4,0,-3.4,0,g);
  });
  room('desk',(g,r)=>{
    const cl=new THREE.Group();[[-.72,-.42,0,'doc'],[.72,-.42,0,'sheet'],[-.72,.42,Math.PI,'slide'],[.72,.42,Math.PI,'doc']].forEach(([x,z,ry,k],i)=>{const d=put(new THREE.Group(),x,0,z,ry,cl);put(desk(1.4,.8),0,0,0,0,d);put(monitor(k,i),0,.77,-.18,0,d);put(rb(.4,.02,.14,'#3B3552',.01),0,.78,.12,0,d);put(chair(['#5B5FC7','#03787C','#E20074','#FFB400'][i]),0,0,.62,Math.PI,d);});
    const w1=person({shirt:'#03787C',hair:'#2B1D16'});put(w1.g,1.9,0,.2,-Math.PI/2,cl);
    solid(cl);tool('apps',r,cl,{x:-1.0,z:-1.4,hy:2.0,stand:[-1.0,.7]});
    const cal=new THREE.Group();put(rb(1.5,1.1,.08,'#FFFFFF',.04),0,1.25,0,0,cal);put(screenMesh(1.4,.94,'cal'),0,1.25,.045,0,cal);[-.6,.6].forEach(x=>put(rb(.06,.75,.06,'#77738A'),x,.38,0,0,cal));
    const mb=put(new THREE.Group(),.95,0,.15,0,cal);put(cyl(.04,.04,.9,'#77738A'),0,.45,0,0,mb);put(rb(.4,.32,.5,'#0F6CBD',.1),0,1.05,0,0,mb);put(rb(.22,.03,.02,'#1C1630',.01),0,1.12,.26,0,mb);
    const flag=put(rb(.04,.22,.1,'#E5383B',.01),.22,1.2,-.1,0,mb);animated.push(t=>{flag.rotation.z=Math.sin(t*2)*.2;});
    solid(cal);tool('outlook',r,cal,{x:2.5,z:-3.6,hy:2.4,stand:[2.5,-2.2]});
    const od=new THREE.Group();put(rb(.55,.7,.6,'#E8DCCB',.05),0,.38,0,0,od);for(let i=0;i<3;i++){put(rb(.5,.18,.02,'#D2C3AE',.02),0,.18+i*.22,.31,0,od);put(rb(.16,.03,.03,'#77738A',.01),0,.2+i*.22,.33,0,od);}
    const cloud=put(new THREE.Group(),0,1.35,0,0,od);[[0,0,0,.2],[.18,-.04,0,.15],[-.18,-.04,0,.15],[.08,.1,0,.14]].forEach(([x,y,z,s])=>put(sph(s,'#62B0F4',glow('#18B4E8',.5)),x,y,z,0,cloud));
    animated.push(t=>{cloud.position.y=1.35+Math.sin(t*1.4)*.08;});
    solid(od);tool('onedrive',r,od,{x:2.8,z:.9,hy:2.0,stand:[2.8,2.2]});
    const pb=new THREE.Group();put(rb(1.7,1.15,.06,'#C99A6B',.03),0,1.25,0,0,pb);put(screenMesh(1.58,1.03,'kanban'),0,1.25,.035,0,pb);[-.7,.7].forEach(x=>put(rb(.06,.72,.06,'#8A6243'),x,.36,0,0,pb));
    solid(pb);tool('planner',r,pb,{x:-3.0,z:2.0,ry:Math.PI/2,hy:2.3,stand:[-1.6,2.0]});
    put(plant(1.1),3.4,0,3.4,0,g);
  });
  room('meet',(g,r)=>{
    const tb=new THREE.Group();put(mesh(geo('oval',()=>{const s=new THREE.Shape();s.absellipse(0,0,1.6,.75,0,Math.PI*2);return new THREE.ExtrudeGeometry(s,{depth:.06,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2});}),mat('#E8DCCB')),0,.76,0,0,tb).rotation.x=-Math.PI/2;
    put(cyl(.25,.35,.72,'#8C8899'),0,.36,0,0,tb);
    [[-1,-.95,0],[0,-.98,0],[1,-.95,0],[-1,.95,Math.PI],[0,.98,Math.PI],[1,.95,Math.PI]].forEach(([x,z,ry],i)=>put(chair(i%2?'#5B5FC7':'#3B3552'),x,0,z,ry,tb));
    put(laptop('chat'),.3,.84,.2,Math.PI,tb);const mic=put(cyl(.12,.14,.05,'#1C1630'),-.4,.86,0,0,tb);
    solid(tb);tool('teams',r,tb,{x:0,z:-.5,hy:1.7,stand:[0,1.3]});
    const sc=new THREE.Group();put(rb(2.5,1.45,.08,'#1C1630',.04),0,1.55,0,0,sc);put(screenMesh(2.36,1.32,'faces'),0,1.55,.045,0,sc);put(rb(.7,.1,.1,'#3B3552',.04),0,2.36,.03,0,sc);put(sph(.03,'#1C1630'),0,2.36,.09,0,sc);
    put(rb(1.2,.5,.4,'#E8DCCB'),0,.25,.05,0,sc);
    solid(sc);tool('rooms',r,sc,{x:0,z:-3.7,hy:2.8,stand:[2.4,-2.3],via:[[2.6,0]]});
    const pd=new THREE.Group();put(rb(1.4,.2,1.0,'#5B5FC7',.05),0,.1,0,0,pd);const lec=put(new THREE.Group(),0,.2,0,0,pd);put(rb(.5,1.0,.4,'#3B3552',.05),0,.5,0,0,lec);put(rb(.6,.06,.45,'#E8DCCB',.02),0,1.03,.03,0,lec).rotation.x=.25;
    const star=put(mesh(geo('pst',()=>new THREE.OctahedronGeometry(.16,0)),mat('#FFB400',glow('#FFB400',.9))),0,1.75,0,0,pd);animated.push(t=>{star.rotation.y=t*1.5;});
    const spot=new THREE.SpotLight('#FFE7B3',dark?6:4,6,.5,.6);spot.position.set(0,3.2,1.2);spot.target=lec;pd.add(spot);
    solid(pd);tool('tpremium',r,pd,{x:-3.0,z:2.1,ry:Math.PI/2,hy:2.2,stand:[-1.7,2.3]});
    const st=new THREE.Group();put(rb(.8,.7,.6,'#E8DCCB'),0,.35,0,0,st);put(rb(.34,.08,.26,'#2A2438',.03),-.12,.74,0,0,st);put(rb(.08,.06,.26,'#3B3552',.03),-.24,.8,0,0,st);
    const hs=put(mesh(geo('hs',()=>new THREE.TorusGeometry(.12,.02,8,20,Math.PI)),mat('#1C1630')),.2,.82,0,0,st);
    solid(st);tool('phone',r,st,{x:3.1,z:2.4,ry:-Math.PI/2,hy:1.6,stand:[1.9,2.6]});
    put(plant(),3.4,0,-3.4,0,g);put(plant(),-3.4,0,-3.4,0,g);
  });
  room('hub',(g,r)=>{
    const sh=new THREE.Group();put(rb(4.4,1.9,.45,'#E8DCCB'),0,.95,0,0,sh);
    const bc=['#E20074','#6D4DFF','#18B4E8','#14A35A','#FFB400','#FF6A13','#03787C'];
    for(let k=0;k<3;k++){put(rb(4.3,.04,.42,'#C99A6B',.01),0,.25+k*.6,.02,0,sh);for(let i=0;i<14;i++)put(rb(.12,.42,.32,bc[(i+k*3)%7],.02),-1.95+i*.3,.48+k*.6,.06,0,sh);}
    solid(sh);tool('sharepoint',r,sh,{x:-.7,z:-3.6,hy:2.5,stand:[-.7,-2.2]});
    const ks=new THREE.Group();put(rb(1.1,1.9,.14,'#2A2438',.05),0,1.15,0,0,ks);put(screenMesh(1.0,1.6,'news'),0,1.2,.075,0,ks);put(rb(.6,.1,.4,'#3B3552'),0,.05,0,0,ks);
    solid(ks);tool('viva',r,ks,{x:2.7,z:.4,ry:-.5,hy:2.6,stand:[2.0,1.8]});
    [[-2.4,1.2,'#FFB400'],[-1.4,1.9,'#6D4DFF'],[-2.8,2.4,'#18B4E8']].forEach(([x,z,c])=>{const bb=put(new THREE.Group(),x,0,z,0,g);put(sph(.42,c),0,.32,0,0,bb);solid(bb);});
    put(rb(.8,.36,.8,'#E8DCCB',.1),-1.9,.18,.4,0,g);put(plant(1.2),3.4,0,3.3,0,g);
  });
  room('ai',(g,r)=>{
    const dk=new THREE.Group();put(desk(1.9,.85,'#3B3552'),0,0,0,0,dk);put(laptop('doc'),-.3,.77,.05,0,dk);
    const orb=put(new THREE.Group(),0,1.75,0,0,dk);put(mesh(geo('orb',()=>new THREE.IcosahedronGeometry(.34,2)),mat('#E20074',{...glow('#C2189C',.9),roughness:.25,metalness:.1})),0,0,0,0,orb);
    const rings=[0,1].map(i=>{const m=mesh(geo('orbr',()=>new THREE.TorusGeometry(.55,.018,8,64)),mat('#8F78FF',glow('#8F78FF',1.6)),false);m.rotation.x=Math.PI/2+i*.6;orb.add(m);return m;});
    const pl=new THREE.PointLight('#E20074',dark?3:2,4);orb.add(pl);
    animated.push(t=>{orb.position.y=1.75+Math.sin(t*1.3)*.1;orb.rotation.y=t*.6;rings[0].rotation.z=t;rings[1].rotation.z=-t*.8;});
    solid(dk);tool('copilot',r,dk,{x:.4,z:-2.6,hy:2.6,stand:[.4,-1.3]});
    const kio=new THREE.Group();put(rb(.6,1.0,.5,'#FFFFFF',.08),0,.5,0,0,kio);const scr=put(new THREE.Group(),0,1.15,.05,0,kio);put(rb(.7,.48,.06,'#1C1630',.04),0,0,0,0,scr);put(screenMesh(.64,.42,'chat'),0,0,.035,0,scr);scr.rotation.x=-.35;
    const gl=put(mesh(geo('kglobe',()=>new THREE.IcosahedronGeometry(.2,1)),mat('#18B4E8',{wireframe:true,...glow('#18B4E8',1)}),false),0,1.75,0,0,kio);animated.push(t=>{gl.rotation.y=t;});
    solid(kio);tool('cchat',r,kio,{x:-2.8,z:.8,hy:2.2,stand:[-2.8,2.1]});
    const ag=new THREE.Group();const bots=[];
    [[-.55,0,'#E20074'],[.05,.25,'#6D4DFF'],[.6,-.1,'#14A35A']].forEach(([x,z,c],i)=>{const b=put(new THREE.Group(),x,0,z,-.3+i*.3,ag);put(rb(.36,.42,.3,'#FFFFFF',.1),0,.42,0,0,b);put(rb(.4,.3,.32,'#FFFFFF',.12),0,.86,0,0,b);put(rb(.3,.13,.02,'#1C1630',.04),0,.88,.16,0,b);
      [-.06,.06].forEach(ex=>put(sph(.025,c,glow(c,2)),ex,.88,.175,0,b));put(cyl(.012,.012,.16,'#77738A'),0,1.09,0,0,b);put(sph(.04,c,glow(c,1.6)),0,1.18,0,0,b);
      [-.2,.2].forEach(ax=>put(cap(.04,.18,'#FFFFFF'),ax,.45,0,0,b));put(cyl(.13,.16,.16,'#C4C9D6'),0,.08,0,0,b);bots.push(b);});
    animated.push(t=>{bots.forEach((b,i)=>{b.position.y=Math.abs(Math.sin(t*2.4+i))*.12;});});
    solid(ag);tool('agents',r,ag,{x:2.5,z:.7,hy:1.9,stand:[2.5,2.1]});
    const bs=new THREE.Group();put(rb(1.6,2.0,.4,'#8A6243'),0,1.0,0,0,bs);for(let k=0;k<4;k++){put(rb(1.5,.03,.36,'#C99A6B',.01),0,.15+k*.48,.03,0,bs);for(let i=0;i<9;i++)put(rb(.1,.3+((i*7+k)%3)*.04,.26,bc2(i+k),.01),-.6+i*.15,.33+k*.48,.04,0,bs);}
    const mg=put(new THREE.Group(),.3,2.3,.25,0,bs);put(mesh(geo('mgr',()=>new THREE.TorusGeometry(.16,.03,8,24)),mat('#FFB400',{metalness:.5,roughness:.3})),0,0,0,0,mg);put(mesh(geo('mgl',()=>new THREE.CircleGeometry(.15,24)),mat('#9FD3F5',{transparent:true,opacity:.45})),0,0,0,0,mg);const hd=put(rb(.06,.24,.05,'#8A6243',.02),.12,-.24,0,0,mg);hd.rotation.z=.6;
    animated.push(t=>{mg.position.x=.3+Math.sin(t*.9)*.35;mg.rotation.z=Math.sin(t*1.3)*.2;});
    solid(bs);tool('researcher',r,bs,{x:-2.9,z:-3.5,hy:2.9,stand:[-2.9,-2.1]});
  });
  function bc2(i){return ['#E20074','#6D4DFF','#18B4E8','#14A35A','#FFB400','#FF6A13'][i%6];}

  /* Fehlt ein Tool im Modell (neu in content.js), bekommt es einen Sockel im Raum */
  tools.forEach((t,i)=>{if(toolObj[t.id])return;const r=ROOMS[t.zone];const p=new THREE.Group();put(cyl(.4,.45,.6,C[t.th]||'#8C8899'),0,.3,0,0,p);put(sph(.22,'#FFFFFF'),0,.85,0,0,p);
    const used=Object.values(toolObj).filter(o=>o.room===r).length;solid(p);tool(t.id,r,p,{x:-2.5+used*1.6,z:2.4,hy:1.6});});

  /* Schilder über den Räumen */
  const labels={};
  function labelTex(text,color){return tex(512,128,(g,w,h)=>{let fs=50;do{g.font=`800 ${fs}px Figtree, system-ui, sans-serif`;fs-=2;}while(g.measureText(text).width>w-84&&fs>22);const tw=Math.min(w-20,g.measureText(text).width+60);g.fillStyle=color;rr(g,(w-tw)/2,14,tw,100,50);g.fill();g.fillStyle='#FFFFFF';g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,66);});}
  zones.forEach(z=>{const r=ROOMS[z.id];const t=labelTex(z.name.replace(/­/g,''),z.id==='door'?'#E20074':TH[zoneTh(z)]);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(4.2,1.05,1);s.position.set(r.cx,z.id==='door'?3.4:3.6,r.cz);s.renderOrder=5;scene.add(s);labels[z.id]=s;});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>texs.forEach(t=>t.userData.redraw&&t.userData.redraw()));

  scene.updateMatrixWorld(true);
  /* Weltkoordinaten der Tool-Punkte und Kollision der Möbel */
  const tmp=new THREE.Vector3();
  const toWorld=(r,x,z)=>{tmp.set(x,0,z);r.g.localToWorld(tmp);return [tmp.x,tmp.z];};
  Object.entries(toolObj).forEach(([id,o])=>{o.wAnchor=o.room.g.localToWorld(o.anchor.clone());o.wStand=toWorld(o.room,...o.stand);o.wVia=o.via.map(v=>toWorld(o.room,...v));o.wLook=toWorld(o.room,...o.look);});
  const box3=new THREE.Box3();
  solids.forEach(o=>{box3.setFromObject(o);if(!isFinite(box3.min.x))return;if(box3.max.x-box3.min.x<.05)return;walls.push([box3.min.x,box3.max.x,box3.min.z,box3.max.z]);});
  const blocked=(x,z)=>walls.some(b=>x>b[0]-R&&x<b[1]+R&&z>b[2]-R&&z<b[3]+R);

  /* ---------- Tilly ---------- */
  const tilly=person({shirt:'#E20074',pants:'#2A2438',glasses:true});
  const logo=put(rb(.14,.14,.02,'#FFFFFF',.02),0,1.12,.215,0,tilly.g);
  const ring=mesh(geo('tring',()=>new THREE.RingGeometry(.32,.42,32)),new THREE.MeshBasicMaterial({color:'#E20074',transparent:true,opacity:.55}),false);ring.rotation.x=-Math.PI/2;ring.position.y=.02;
  const av=new THREE.Group();av.add(tilly.g,ring);scene.add(av);
  const pos=new THREE.Vector3(-11.2,0,0);av.position.copy(pos);let facing=Math.PI/2;
  const marker=mesh(geo('mk',()=>new THREE.RingGeometry(.18,.3,24)),new THREE.MeshBasicMaterial({color:'#E20074',transparent:true,opacity:.9}),false);marker.rotation.x=-Math.PI/2;marker.visible=false;scene.add(marker);

  /* ---------- Wege ---------- */
  function regionAt(x,z){
    if(x>=-10&&x<2&&Math.abs(z)<6)return 'door';
    if(x>=2&&x<=34&&Math.abs(z)<2)return 'hall';
    if(x>=2&&x<=34&&z<=-2&&z>=-10)return NORTH[Math.min(3,Math.floor((x-2)/8))];
    if(x>=2&&x<=34&&z>=2&&z<=10)return SOUTH[Math.min(3,Math.floor((x-2)/8))];
    if(x<-10&&x>-13&&Math.abs(z)<1.6)return 'out';
    return null;
  }
  const exits=id=>id==='door'?[[1.0,0],[3.2,0]]:[[ROOMS[id].cx,ROOMS[id].side*3.2],[ROOMS[id].cx,0]];
  /* Wege führen immer über Türen und Flur: Raum → Tür → Flur → Tür → Raum */
  function route(tx,tz){
    let from=regionAt(pos.x,pos.z)||'hall';const to=regionAt(tx,tz);if(!to)return null;
    if(from===to)return [[tx,tz]];
    if(to==='out'){const r=route(-9.4,0);r.push([tx,tz]);return r;}
    const p=[];
    if(from==='out'){p.push([-9.4,0]);from='door';}
    if(from!==to){
      if(from!=='hall'){const e=exits(from);p.push(e[0],e[1]);}
      if(to!=='hall'){const e=exits(to);p.push(e[1],e[0]);}
    }
    p.push([tx,tz]);
    return p.filter((q,i)=>!i||Math.hypot(q[0]-p[i-1][0],q[1]-p[i-1][1])>.05);
  }
  let path=[],goal=null,stuck=0,lastD=1e9;
  function walkTo(tx,tz,onArrive){const r=route(tx,tz);if(!r)return false;path=r;goal=onArrive||null;stuck=0;lastD=1e9;marker.position.set(tx,.03,tz);marker.visible=!onArrive;return true;}

  /* ---------- Kamera ---------- */
  let yaw=.5,dist=mobile?17:15.5,camDist=dist,focus=null;const pitch=.84;
  const camPos=new THREE.Vector3(),camLook=new THREE.Vector3(pos.x,1,pos.z);
  function placeCamera(dt,snap){
    const tgt=focus?new THREE.Vector3((pos.x+focus[0])/2,1,(pos.z+focus[1])/2):new THREE.Vector3(pos.x,1,pos.z);
    const d=focus?Math.min(dist,10.5):dist;
    const k=snap||reduced?1:1-Math.pow(.0015,dt);
    camLook.lerp(tgt,k);camDist+=(d-camDist)*k;
    camPos.set(camLook.x+Math.sin(yaw)*Math.cos(pitch)*camDist,camLook.y+Math.sin(pitch)*camDist,camLook.z+Math.cos(yaw)*Math.cos(pitch)*camDist);
    camera.position.copy(camPos);camera.lookAt(camLook);
  }

  /* ---------- Oberfläche ---------- */
  let cur=null,openId=null;
  const seenIn=z=>z.tools.filter(t=>api.seen(t.id)).length;
  function chipsHTML(){return zones.map(z=>{const n=seenIn(z),all=n===z.tools.length;return `<button class="ochip ch-${THEMES_CH(z)}${cur===z.id?' on':''}" data-room="${z.id}" aria-pressed="${cur===z.id}">${all?'<i>✓</i>':''}${api.esc(z.name)}<small>${n}/${z.tools.length}</small></button>`;}).join('');}
  const THEMES_CH=z=>api.themes[zoneTh(z)].ch;
  function renderChips(){elChips.innerHTML=chipsHTML();const on=elChips.querySelector('.on');if(on)on.scrollIntoView({inline:'center',block:'nearest',behavior:reduced?'auto':'smooth'});}
  function renderRoom(){
    const z=cur&&zoneById[cur];
    if(!z){elRoom.innerHTML=cur==='hall'?`<b>Flur</b><span>Oben liegt die Sicherheit, unten wird gearbeitet. Wähle einen Raum.</span>`:`<b>Vor dem Büro</b><span>Geh durch den Eingang zum Empfang.</span>`;elRoom.className='oroom';return;}
    const th=api.themes[zoneTh(z)];
    elRoom.className='oroom ch-'+th.ch;
    elRoom.innerHTML=`<b>${api.esc(z.name)}</b><span>${api.esc(z.intro)}</span><small>${seenIn(z)}/${z.tools.length} erkundet · ${z.th.map(k=>api.themes[k].n).join(' & ')}</small>`;
  }
  const hsBtns={};
  function renderHotspots(){
    elHs.innerHTML='';Object.keys(hsBtns).forEach(k=>delete hsBtns[k]);
    if(!cur||!zoneById[cur])return;
    zoneById[cur].tools.forEach(t=>{const b=document.createElement('button');b.className='ohs ch-'+api.themes[t.th].ch+(api.seen(t.id)?' seen':'')+(openId===t.id?' on':'');b.dataset.tool=t.id;
      b.innerHTML=`<span class="ohs-d" aria-hidden="true">${api.seen(t.id)?'✓':'i'}</span><span class="ohs-l">${api.esc(SHORT[t.id]||t.name)}</span>`;b.setAttribute('aria-label',`${t.name} ansehen`);elHs.appendChild(b);hsBtns[t.id]=b;});
  }
  function setRoom(id){if(id===cur)return;cur=id;Object.entries(labels).forEach(([k,s])=>s.visible=k!==cur);renderRoom();renderChips();renderHotspots();}
  const order=tools.map(t=>t.id);
  function openCard(id){
    const t=toolById[id];openId=id;api.markSeen(id);
    const i=order.indexOf(id),prev=order[(i-1+order.length)%order.length],next=order[(i+1)%order.length];
    elCard.className='ocard ch-'+api.themes[t.th].ch;
    elCard.innerHTML=`<div class="ocard-h"><span class="ocard-k">${api.esc(api.themes[t.th].n)} · ${api.esc(zoneById[t.zone].name)}</span><h3 tabindex="-1">${api.esc(t.name)}</h3>
      <button class="ocard-x" data-close aria-label="Schließen">×</button></div><div class="ltb">${api.cardBody(t)}</div>
      <div class="ocard-f"><button class="btn small ghost" data-goto="${prev}">← Zurück</button><button class="btn small" data-goto="${next}">Nächstes Tool →</button></div>`;
    elCard.hidden=false;const o=toolObj[id];focus=o.wLook;
    const h=elCard.querySelector('h3');h.focus({preventScroll:true});elCard.scrollTop=0;
    renderRoom();renderChips();renderHotspots();api.onProgress();
  }
  function closeCard(){elCard.hidden=true;openId=null;focus=null;renderHotspots();root.focus({preventScroll:true});}
  function goTool(id){const o=toolObj[id];if(!o)return;closeCardSoft();
    const r=route(...o.wStand);if(!r){openCard(id);return;}
    if(o.wVia.length&&regionAt(pos.x,pos.z)!==o.room.id){const last=r.pop();r.push(...o.wVia,last);}
    path=r;goal=()=>{facing=Math.atan2(o.wLook[0]-pos.x,o.wLook[1]-pos.z);openCard(id);};stuck=0;lastD=1e9;marker.visible=false;}
  function closeCardSoft(){if(!elCard.hidden){elCard.hidden=true;openId=null;focus=null;}}
  function goRoom(id){closeCardSoft();if(id==='door'){walkTo(-2.0,0);return;}const r=ROOMS[id];walkTo(r.cx,r.side*5.2);}

  /* ---------- Eingabe ---------- */
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
  const toolMeshes=[];Object.values(toolObj).forEach(o=>o.obj.traverse(m=>{if(m.isMesh)toolMeshes.push(m);}));
  let down=null;
  const onDown=e=>{if(e.button>0)return;down={x:e.clientX,y:e.clientY,yaw,moved:false,id:e.pointerId};canvas.setPointerCapture(e.pointerId);};
  const onMove=e=>{if(!down)return;const dx=e.clientX-down.x;if(Math.abs(dx)+Math.abs(e.clientY-down.y)>7)down.moved=true;if(down.moved)yaw=down.yaw-dx*.006;};
  const onUp=e=>{if(!down)return;const wasTap=!down.moved;down=null;if(!wasTap)return;
    const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);
    const hit=ray.intersectObjects(toolMeshes,false)[0];if(hit){goTool(hit.object.userData.tool);hideHint();return;}
    const p=new THREE.Vector3();if(ray.ray.intersectPlane(floorPlane,p)){closeCardSoft();if(walkTo(p.x,p.z))hideHint();}};
  const onWheel=e=>{e.preventDefault();dist=Math.max(7,Math.min(24,dist+Math.sign(e.deltaY)*1.2));};
  canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',()=>{down=null;});
  canvas.addEventListener('wheel',onWheel,{passive:false});
  const keys=new Set();
  const KEYMAP={ArrowUp:'f',KeyW:'f',ArrowDown:'b',KeyS:'b',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
  const onKeyDown=e=>{if(e.key==='Escape'){if(!elCard.hidden){closeCard();e.preventDefault();}else if(root.classList.contains('max'))toggleMax();return;}
    if(e.target.closest&&e.target.closest('.ocard'))return;const k=KEYMAP[e.code];if(k){keys.add(k);path=[];goal=null;marker.visible=false;e.preventDefault();hideHint();}
    if(e.code==='KeyQ')yaw+=.4;if(e.code==='KeyE')yaw-=.4;};
  const onKeyUp=e=>{const k=KEYMAP[e.code];if(k)keys.delete(k);};
  root.addEventListener('keydown',onKeyDown);root.addEventListener('keyup',onKeyUp);root.addEventListener('blur',()=>keys.clear(),true);
  function toggleMax(){root.classList.toggle('max');document.body.classList.toggle('o3d-max',root.classList.contains('max'));resize();}
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.tool){goTool(b.dataset.tool);hideHint();}
    else if(b.dataset.room){goRoom(b.dataset.room);hideHint();}
    else if(b.dataset.goto){goTool(b.dataset.goto);}
    else if(b.hasAttribute('data-close'))closeCard();
    else if(b.dataset.o){const o=b.dataset.o;if(o==='left')yaw+=Math.PI/4;if(o==='right')yaw-=Math.PI/4;if(o==='in')dist=Math.max(7,dist-2);if(o==='out')dist=Math.min(24,dist+2);if(o==='max')toggleMax();}
    else if(b.id==='oHintOk'){hideHint();walkTo(-6.5,0);}
  });
  let hintShown=false;try{hintShown=localStorage.getItem('ml-office-hint')==='1';}catch(e){}
  if(!hintShown)elHint.hidden=false;
  function hideHint(){if(elHint.hidden)return;elHint.hidden=true;try{localStorage.setItem('ml-office-hint','1');}catch(e){}}

  /* ---------- Schleife ---------- */
  function resize(){const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.8?52:42;camera.updateProjectionMatrix();}
  const ro=new ResizeObserver(resize);ro.observe(root);resize();
  const clock=new THREE.Clock();let t=0,walkPhase=0,viewOff=0;
  function step(){
    const dt=Math.min(.1,clock.getDelta());t+=dt;
    let moving=false;
    if(keys.size){const f=(keys.has('f')?1:0)-(keys.has('b')?1:0),s=(keys.has('r')?1:0)-(keys.has('l')?1:0);
      if(f||s){const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);let mx=fx*f+rx*s,mz=fz*f+rz*s;const l=Math.hypot(mx,mz);mx/=l;mz/=l;
        const nx=pos.x+mx*SPEED*dt,nz=pos.z+mz*SPEED*dt;if(!blocked(nx,pos.z)&&regionAt(nx,pos.z))pos.x=nx;if(!blocked(pos.x,nz)&&regionAt(pos.x,nz))pos.z=nz;facing=Math.atan2(mx,mz);moving=true;if(!elCard.hidden)closeCardSoft();}}
    else if(path.length){const [tx,tz]=path[0],dx=tx-pos.x,dz=tz-pos.z,d=Math.hypot(dx,dz);
      if(d<.06){path.shift();lastD=1e9;stuck=0;if(!path.length){marker.visible=false;if(goal){const g=goal;goal=null;g();}}}
      else{const s=Math.min(d,SPEED*dt),mx=dx/d*s,mz=dz/d*s;const ox=pos.x,oz=pos.z;
        if(!blocked(pos.x+mx,pos.z))pos.x+=mx;if(!blocked(pos.x,pos.z+mz))pos.z+=mz;
        facing=Math.atan2(dx,dz);moving=true;
        if(d>lastD-.002){stuck+=dt;if(stuck>.5){path.shift();stuck=0;lastD=1e9;if(!path.length){marker.visible=false;if(goal){const g=goal;goal=null;g();}}}}else{stuck=0;}lastD=Math.min(lastD,d);}}
    av.position.copy(pos);
    let a=facing-tilly.g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));tilly.g.rotation.y+=a*Math.min(1,dt*12);
    if(moving){walkPhase+=dt*11;}else walkPhase*=.85;
    const sw=moving?Math.sin(walkPhase)*.55:0;
    tilly.legs[0].rotation.x=sw;tilly.legs[1].rotation.x=-sw;tilly.arms[0].rotation.x=-sw*.8;tilly.arms[1].rotation.x=sw*.8;
    tilly.g.position.y=moving?Math.abs(Math.sin(walkPhase))*.06:(reduced?0:Math.sin(t*2)*.015);
    ring.material.opacity=.35+(reduced?0:Math.sin(t*3)*.15);
    if(marker.visible){marker.scale.setScalar(1+(reduced?0:Math.sin(t*5)*.12));}
    if(!reduced)animated.forEach(f=>f(t));
    const rg=regionAt(pos.x,pos.z);if(rg&&rg!==cur)setRoom(rg==='out'?'out':rg);
    placeCamera(dt,false);
    /* Bei offener Karte rückt die Szene nach links, damit das Objekt sichtbar bleibt */
    const cw=!elCard.hidden&&root.clientWidth>600?elCard.offsetWidth/2:0;viewOff+=(cw-viewOff)*(reduced?1:Math.min(1,dt*6));
    if(Math.abs(viewOff)>.5)camera.setViewOffset(root.clientWidth,root.clientHeight,viewOff,0,root.clientWidth,root.clientHeight);else camera.clearViewOffset();
    renderer.render(scene,camera);
    /* Punkte über den Objekten mitführen */
    const w=root.clientWidth,h=root.clientHeight;
    for(const id in hsBtns){const v=toolObj[id].wAnchor.clone();if(!reduced)v.y+=Math.sin(t*2+id.length)*.05;v.project(camera);const b=hsBtns[id];
      if(v.z>1||v.x<-1.1||v.x>1.1||v.y<-1.1||v.y>1.1){b.style.visibility='hidden';continue;}b.style.visibility='';b.style.transform=`translate(${(v.x+1)/2*w}px,${(1-v.y)/2*h}px) translate(-50%,-50%)`;}
  }
  let running=true;
  renderer.setAnimationLoop(()=>{if(running)step();});
  const onVis=()=>{running=!document.hidden;clock.getDelta();};document.addEventListener('visibilitychange',onVis);
  setRoom('out');placeCamera(0,true);

  return {
    goTool,
    /* für Tests: Position, Raum und Tools, deren Standplatz in einem Möbel liegt */
    debug:()=>({pos:[pos.x,pos.z],room:cur,open:openId,blockedStands:Object.entries(toolObj).filter(([,o])=>blocked(...o.wStand)).map(([id])=>id),missing:tools.filter(t=>!toolObj[t.id]).map(t=>t.id)}),
    destroy(){renderer.setAnimationLoop(null);ro.disconnect();document.removeEventListener('visibilitychange',onVis);document.body.classList.remove('o3d-max');
      scene.traverse(o=>{if(o.isMesh||o.isSprite){if(o.material.map)o.material.map.dispose();o.material.dispose();}});
      geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());texs.forEach(x=>x.dispose());renderer.dispose();renderer.forceContextLoss();}
  };
}
