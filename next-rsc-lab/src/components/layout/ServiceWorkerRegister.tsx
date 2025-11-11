'use client'

import { useEffect } from 'react'

const SW_PATH = '/sw.js'
const SW_UPDATED_EVENT = 'swUpdated'

declare global {
  interface WindowEventMap {
    [SW_UPDATED_EVENT]: CustomEvent<ServiceWorkerRegistration>
  }
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let isMounted = true

    const notifyUpdate = (registration: ServiceWorkerRegistration) => {
      window.dispatchEvent(new CustomEvent(SW_UPDATED_EVENT, { detail: registration }))
    }

    const watchRegistration = (registration: ServiceWorkerRegistration) => {
      if (!isMounted) return
      if (registration.waiting) {
        notifyUpdate(registration)
      }
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing
        if (!installingWorker) return
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUpdate(registration)
          }
        })
      })
    }

    navigator.serviceWorker
      .register(SW_PATH, { scope: '/' })
      .then((registration) => {
        watchRegistration(registration)
      })
      .catch((error) => {
        console.warn('[ServiceWorker] 注册失败:', error)
      })

    navigator.serviceWorker.ready.then((registration) => {
      watchRegistration(registration)
    })

    return () => {
      isMounted = false
    }
  }, [])

  return null
}
