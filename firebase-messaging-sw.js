/* Service Worker de Firebase Cloud Messaging - GPTAXI
   Mismo directorio que index.html. Convive con sw.js (otro scope). */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB9LEKcYzjYRrnvjG2hEOLO_jDK763qbHA",
  authDomain: "gpataxichofer.firebaseapp.com",
  projectId: "gpataxichofer",
  messagingSenderId: "355052013384",
  appId: "1:355052013384:web:c0af226507b785513d557d"
});

const messaging = firebase.messaging();

// Mensajes SOLO "data" (sin clave notification): el SW muestra la alerta,
// así controlamos vibración, persistencia y sin duplicados.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || "GPTAXI", {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "badge-96.png",
    tag: d.tag || "gptaxi",
    renotify: true,
    requireInteraction: true,
    silent: false,
    lang: "es",
    vibrate: [600, 200, 600, 200, 600, 200, 900],
    timestamp: Date.now(),
    data: { url: d.url || "./" }
  });
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope.replace("fcm-scope/", "")).href;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) if ("focus" in c) { c.postMessage({ type: "push" }); return c.focus(); }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
