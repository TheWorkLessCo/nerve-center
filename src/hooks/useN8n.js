import { useState, useCallback, useMemo } from 'react'

function useN8n() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const baseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || ''
  const apiSecret = import.meta.env.VITE_API_SECRET || ''

  const callWebhook = useCallback(async (endpoint, payload, method = 'POST') => {
    if (!baseUrl) {
      return { data: null, error: 'N8N webhook URL not configured' }
    }

    setLoading(true)
    setError(null)

    try {
      const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl.replace(/\/$/, '')}${endpoint}`

      const headers = {
        'Content-Type': 'application/json',
        ...(apiSecret && { 'X-API-Secret': apiSecret }),
      }

      const response = await fetch(url, {
        method,
        headers,
        ...(payload && { body: JSON.stringify(payload) }),
      })

      const contentType = response.headers.get('content-type')
      let data
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        return { data, error: `HTTP ${response.status}: ${response.statusText}` }
      } else {
        setError(null)
      }

      return { data, error: null }
    } catch (err) {
      const message = err.message || 'Request failed'
      setError(message)
      return { data: null, error: message }
    } finally {
      setLoading(false)
    }
  }, [baseUrl, apiSecret])

  const callMemoryList = useCallback(() => {
    const endpoint = import.meta.env.VITE_N8N_MEMORY_LIST || '/nerve-memory-list'
    if (endpoint.startsWith('http')) {
      return callWebhook(endpoint, null, 'GET')
    }
    return callWebhook(endpoint, null, 'GET')
  }, [callWebhook])

  const callMemoryRead = useCallback((filename, directory) => {
    const endpoint = import.meta.env.VITE_N8N_MEMORY_READ || '/nerve-memory-read'
    if (endpoint.startsWith('http')) {
      return callWebhook(endpoint, { filename, directory })
    }
    return callWebhook(endpoint, { filename, directory })
  }, [callWebhook])

  const callMemoryWrite = useCallback((filename, directory, content) => {
    const endpoint = import.meta.env.VITE_N8N_MEMORY_WRITE || '/nerve-memory-write'
    if (endpoint.startsWith('http')) {
      return callWebhook(endpoint, { filename, directory, content })
    }
    return callWebhook(endpoint, { filename, directory, content })
  }, [callWebhook])

  const callChat = useCallback((message, history = []) => {
    const endpoint = import.meta.env.VITE_N8N_CHAT || '/nerve-chat'
    if (endpoint.startsWith('http')) {
      return callWebhook(endpoint, { message, history })
    }
    return callWebhook(endpoint, { message, history })
  }, [callWebhook])

  return useMemo(() => ({
    loading,
    error,
    callWebhook,
    callMemoryList,
    callMemoryRead,
    callMemoryWrite,
    callChat,
  }), [loading, error, callWebhook, callMemoryList, callMemoryRead, callMemoryWrite, callChat])
}

export default useN8n
