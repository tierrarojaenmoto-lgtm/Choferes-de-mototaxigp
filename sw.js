// Service worker: guarda lo básico de la app y muestra las notificaciones push (con la app cerrada o el celular bloqueado)
const V="gptaxi-v6",BASE=["./","index.html","manifest.json","icon-192.png","icon-512.png","badge-96.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(_){}
  e.waitUntil((async()=>{
    await self.registration.showNotification(d.title||"GPTAXI",{body:d.body||"",icon:"icon-192.png",badge:"badge-96.png",tag:d.tag||"gptaxi",renotify:false,requireInteraction:true,lang:"es",timestamp:Date.now(),vibrate:[600,200,600,200,600,200,900],actions:[{action:"abrir",title:"Abrir GPTAXI"}],data:{url:d.url||"./"}});
    (await clients.matchAll({type:"window",includeUncontrolled:true})).forEach(c=>c.postMessage({type:"push",kind:d.kind}));
  })())});
self.addEventListener("notificationclick",e=>{e.notification.close();
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if("focus" in c)return c.focus()}return clients.openWindow((e.notification.data&&e.notification.data.url)||"./")}))});
