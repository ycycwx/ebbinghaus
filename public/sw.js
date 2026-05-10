const CACHE_NAME = "ebbinghaus-v1"

const APP_SHELL = [
    "/",
    "/manifest.webmanifest",
    "/pwa-192.png",
    "/pwa-512.png"
]

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    )
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    )
})

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return
    }

    event.respondWith(
        fetch(event.request).catch(async () => {
            const cached = await caches.match(event.request)
            return cached ?? Response.error()
        })
    )
})
