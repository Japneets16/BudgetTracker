// Service Worker for Smart Expense Tracker PWA
// Handles caching, offline functionality, and background sync

const CACHE_NAME = 'expense-tracker-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker: Installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Install failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activated successfully')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests differently
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If online, return fresh data and cache it
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response
              }
              // Return a generic offline response for API calls
              return new Response(
                JSON.stringify({ 
                  error: 'You are offline', 
                  cached: true 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              )
            })
        })
    )
    return
  }

  // Handle page requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Add to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // If network fails, try to serve offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Background sync for offline expense submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered')
  
  if (event.tag === 'expense-sync') {
    event.waitUntil(syncExpenses())
  }
})

// Sync offline expenses when back online
async function syncExpenses() {
  try {
    // Get pending expenses from IndexedDB
    const pendingExpenses = await getPendingExpenses()
    
    if (pendingExpenses.length > 0) {
      console.log(`Service Worker: Syncing ${pendingExpenses.length} offline expenses`)
      
      for (const expense of pendingExpenses) {
        try {
          // Submit to API
          const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await getStoredToken()}`
            },
            body: JSON.stringify(expense)
          })
          
          if (response.ok) {
            // Remove from pending queue
            await removePendingExpense(expense.id)
            console.log('Service Worker: Synced expense', expense.title)
          }
        } catch (error) {
          console.error('Service Worker: Failed to sync expense', error)
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Sync failed', error)
  }
}

// Helper functions for IndexedDB operations
async function getPendingExpenses() {
  // In a real implementation, you'd use IndexedDB
  // For now, return empty array
  return []
}

async function removePendingExpense(id) {
  // Implementation would remove from IndexedDB
  console.log('Removing pending expense:', id)
}

async function getStoredToken() {
  // Get token from clients
  const clients = await self.clients.matchAll()
  if (clients.length > 0) {
    // Send message to get token
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.token)
      }
      clients[0].postMessage({ type: 'GET_TOKEN' }, [messageChannel.port2])
    })
  }
  return null
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Smart Expense Tracker', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})