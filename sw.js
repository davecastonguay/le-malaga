// Offline support. Bump VERSION whenever any file changes, so guests get the update.
// Keep ASSETS in sync with the files the page uses (videos are left out on purpose:
// they stream from the network and show their poster image when offline).
const VERSION = "malaga-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./content.js",
  "./manifest.webmanifest",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/bain.jpg",
  "./img/bois.jpg",
  "./img/chambre1.jpg",
  "./img/chambre2.jpg",
  "./img/cuisine.jpg",
  "./img/cuisiniere.jpg",
  "./img/entree.jpg",
  "./img/fenetre.jpg",
  "./img/feu-camp.jpg",
  "./img/foyer.jpg",
  "./img/hero.jpg",
  "./img/kayaks.jpg",
  "./img/maison-lac.jpg",
  "./img/patio.jpg",
  "./img/pingpong.jpg",
  "./img/porte-ext.jpg",
  "./img/porte-int.jpg",
  "./img/quai-poster.jpg",
  "./img/salle-jeux.jpg",
  "./img/salon.jpg",
  "./img/terrain.jpg",
  "./img/terrasse-poster.jpg",
  "./img/terrasse.jpg",
  "./img/thermostat.jpg",
  "./img/vue.jpg",
  "./img/vinyle-levier.jpg",
  "./img/vinyle-son.jpg",
  "./img/vinyle-poster.jpg",
  "./img/foyer-ouvrir-poster.jpg",
  "./img/foyer-pendant-poster.jpg",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.endsWith(".mp4") || url.pathname.endsWith(".pdf")) return; // network only
  // Page itself: network first so updates show up, cache when offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // Text and code (content.js, manifest): network first too, so edits show up right away.
  if (url.origin === location.origin && /\.(js|webmanifest|svg)$/.test(url.pathname)) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req)));
    return;
  }
  // Everything else (photos, text, Google Fonts): cache first, then network.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
