#!/usr/bin/env node
/* Baut MagentaLingo als eine einzige HTML-Datei zum Herunterladen.
   Inhalte, Schriften, Icons und das 3D-Büro (inkl. Three.js) stecken in der Datei,
   sie öffnet sich per Doppelklick ohne Entpacken und ohne Webserver.
   Aufruf: node tools/build-standalone.js [Zieldatei]   (Standard: MagentaLingo.html im aktuellen Ordner) */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f));
const dataUri=(f,type)=>`data:${type};base64,${read(f).toString('base64')}`;
const out=path.resolve(process.argv[2]||'MagentaLingo.html');

let html=read('index.html').toString('utf8');
const rep=(a,b)=>{if(!html.includes(a))throw new Error('Nicht gefunden: '+a.slice(0,60));html=html.split(a).join(b);};
const repRe=(re,b)=>{if(!re.test(html))throw new Error('Nicht gefunden: '+re);html=html.replace(re,b);};

/* Icons und Schriften direkt einbetten, Manifest und Font-Preload entfallen */
rep('href="icons/icon-128.png"',`href="${dataUri('icons/icon-128.png','image/png')}"`);
rep('href="icons/icon-192.png"',`href="${dataUri('icons/icon-192.png','image/png')}"`);
repRe(/<link rel="manifest"[^>]*>\n?/,'');
repRe(/<link rel="preload"[^>]*>\n?/,'');
rep('url(fonts/bricolage-grotesque-latin.woff2)',`url(${dataUri('fonts/bricolage-grotesque-latin.woff2','font/woff2')})`);
rep('url(fonts/figtree-latin.woff2)',`url(${dataUri('fonts/figtree-latin.woff2','font/woff2')})`);
rep("const LOGO_URI='icons/icon-128.png';",`const LOGO_URI='${dataUri('icons/icon-128.png','image/png')}';`);

/* Inhalte inline */
repRe(/<script src="content\.js\?v=[^"]*"><\/script>/,()=>`<script>\n${read('content.js').toString('utf8')}\n</script>`);

/* 3D-Büro: Module als Base64 einbetten und zur Laufzeit über Blob-URLs laden */
const b64=f=>read(f).toString('base64');
const mods=`<script type="text/plain" id="ml-three">${b64('vendor/three/three.module.min.js')}</script>
<script type="text/plain" id="ml-rbox">${b64('vendor/three/RoundedBoxGeometry.js')}</script>
<script type="text/plain" id="ml-office">${b64('office3d.js')}</script>
<script>
/* Eigenständige Datei: 3D-Module liegen oben als Base64 und werden als Blob-Module geladen */
let ML_O3D=null;
function loadOffice3D(){
  if(ML_O3D)return ML_O3D;
  const src=id=>new TextDecoder().decode(Uint8Array.from(atob(document.getElementById(id).textContent),c=>c.charCodeAt(0)));
  const url=s=>URL.createObjectURL(new Blob([s],{type:'text/javascript'}));
  const three=url(src('ml-three'));
  const rbox=url(src('ml-rbox').replace("'./three.module.min.js'",JSON.stringify(three)));
  const office=url(src('ml-office').replace("'./vendor/three/three.module.min.js'",JSON.stringify(three)).replace("'./vendor/three/RoundedBoxGeometry.js'",JSON.stringify(rbox)));
  return ML_O3D=import(office);
}
</script>`;
rep("import('./office3d.js?v='+APP_V)","loadOffice3D()");
rep('</body>',mods+'\n</body>');

/* Offline-Speicher (Service Worker) gibt es für eine einzelne Datei nicht */
repRe(/if\('serviceWorker' in navigator[^\n]*\n/,'');

if(/(src|href)="(?!data:|https?:|#)[^"]+\.(js|png|woff2|webmanifest)/.test(html))throw new Error('Es ist noch ein Verweis auf eine externe Datei übrig');
fs.writeFileSync(out,html);
console.log(`${out} (${Math.round(fs.statSync(out).size/1024)} KB)`);
