import { useState, useCallback, useContext, createContext } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#5DCAA5" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#E24B4A" strokeWidth="1.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#5DCAA5" strokeWidth="1.5" />
        <path d="M8 7v4M8 5.5v.5" stroke="#5DCAA5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  }

  const bgColors = {
    success: 'bg-white dark:bg-[#1a1a1a] border-[#5DCAA5]/30',
    error: 'bg-white dark:bg-[#1a1a1a] border-[#E24B4A]/30',
    info: 'bg-white dark:bg-[#1a1a1a] border-[#5DCAA5]/30',
  }

  const textColors = {
    success: 'text-[#1a1a1a] dark:text-[#fafafa]',
    error: 'text-[#E24B4A]',
    info: 'text-[#1a1a1a] dark:text-[#fafafa]',
  }

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[260px] max-w-[380px] ${bgColors[toast.type]}`}
    >
      <span className="flex-shrink-0">{icons[toast.type]}</span>
      <p className={`text-sm font-medium flex-1 ${textColors[toast.type]}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-[#888888] hover:text-[#1a1a1a] dark:hover:text-[#fafafa] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default useToast
