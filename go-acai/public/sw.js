const CACHE = 'goacai-v4'

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => caches.delete(k)))
    }).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('message', e => {
  if (e.data === 'force') {
    self.skipWaiting()
    self.clients.claim()
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  }
})

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
    return
  }
  if (e.request.url.includes('/_next/static/') || e.request.url.match(/\.(js|css|png|jpg|svg|ico)$/)) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(cache => cache.put(e.request, clone))
        return res
      }).catch(() => caches.match(e.request))
    )
    return
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})

self.addEventListener('push', e => {
  if (!e.data) return
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  })
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = e.notification.data?.url || '/'
  e.waitUntil(clients.openWindow(url))
})
