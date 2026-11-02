/* Busca a versão nova quando há internet; sem internet, abre a última guardada. */
const CACHE="ritmo-v1";
const ARQUIVOS=["./","manifest.webmanifest","icone.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c))}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./"))));
});
