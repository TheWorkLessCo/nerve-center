import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useNetwork — detects online/offline state and queues actions for retry.
 *
 * Returns: {
 *   isOnline: boolean,
 *   wasOffline: boolean,   // true briefly after reconnecting
 *   queueAction: (fn: () => Promise<any>) => void,
 * }
 */
function useNetwork() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const queueRef = useRef([])

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      setTimeout(() => setWasOffline(false), 5000)
      // Drain queued actions
      queueRef.current.forEach(fn => fn())
      queueRef.current = []
    }

    const onOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const queueAction = useCallback((fn) => {
    if (isOnline) {
      fn()
    } else {
      queueRef.current.push(fn)
    }
  }, [isOnline])

  return { isOnline, wasOffline, queueAction }
}

export default useNetwork
