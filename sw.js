/* Service Worker: hält die App offline verfügbar.
   Bei jeder inhaltlichen Änderung VERSION erhöhen, dann holen sich alle Geräte die neuen Dateien. */
const VERSION='ml-2026-10-29c';
const FILES=['./','index.html','content.js','office3d.js','vendor/three/three.module.min.js','vendor/three/RoundedBoxGeometry.js','manifest.webmanifest','fonts/bricolage-grotesque-latin.woff2','fonts/figtree-latin.woff2','icons/icon-128.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
/* Erst das Netz fragen (am Browser-Zwischenspeicher vorbei), damit Inhalte aktuell sind; ohne Netz aus dem Cache */
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
