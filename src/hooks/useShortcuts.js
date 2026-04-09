import { useEffect, useCallback, useRef } from 'react'

/**
 * useShortcuts — attaches global keyboard shortcuts.
 *
 * callbacks: {
 *   search: () => void,   // Ctrl/Cmd+K — focus search
 *   send: () => void,     // Ctrl/Cmd+Enter — send message
 *   save: () => void,     // Ctrl/Cmd+S — save file
 *   escape: () => void,   // Esc — close modals/side panels
 * }
 */
function useShortcuts(callbacks = {}) {
  const callbacksRef = useRef(callbacks)

  // Keep ref current so handleKeyDown always accesses latest without being recreated
  useEffect(() => {
    callbacksRef.current = callbacks
  })

  const handleKeyDown = useCallback((e) => {
    const isMac = navigator.platform.includes('Mac')
    const modKey = isMac ? e.metaKey : e.ctrlKey

    if (!modKey) return

    switch (e.key.toLowerCase()) {
      case 'k':
        e.preventDefault()
        callbacksRef.current.search?.()
        break
      case 'enter':
        if (e.target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          callbacksRef.current.send?.()
        }
        break
      case 's':
        e.preventDefault()
        callbacksRef.current.save?.()
        break
      case 'escape':
        callbacksRef.current.escape?.()
        break
    }
  }, []) // NO callbacks dep — stable function identity

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export default useShortcuts
