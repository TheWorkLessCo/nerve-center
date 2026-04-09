import { useState, useRef, useEffect, useCallback } from 'react'
import ChatMessage from '../components/ChatMessage'
import { Send, Zap, Brain, FileText, Activity, Loader2 } from 'lucide-react'
import useShortcuts from '../hooks/useShortcuts'
import { supabase } from '../lib/supabase'
import useN8n from '../hooks/useN8n'

const QUICK_ACTIONS = [
  { label: 'Agent status', icon: Activity, prompt: 'What is the current status of all agents?' },
  { label: 'Pipeline', icon: Zap, prompt: 'Show me the current pipeline status and any bottlenecks.' },
  { label: 'Memory', icon: Brain, prompt: 'Sync and review the current memory files.' },
  { label: 'Docs', icon: FileText, prompt: 'Search docs for relevant information.' },
]

function ChatView() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const messagesEndRef = useRef(null)
  const { callChat } = useN8n()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Keyboard shortcuts
  useShortcuts({
    send: () => handleSend(),
    escape: () => {},
  })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load last 50 messages from Supabase on mount
  useEffect(() => {
    const loadHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (!error && data) {
        setMessages(data.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          agent: m.agent || 'Sabbath',
          timestamp: new Date(m.created_at),
        })))
      }
      setLoadingHistory(false)
    }
    loadHistory()
  }, [])

  // Real-time subscription for new chat messages
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, {
              id: newMsg.id,
              role: newMsg.role,
              content: newMsg.content,
              agent: newMsg.agent || 'Sabbath',
              timestamp: new Date(newMsg.created_at),
            }]
          })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const handleSend = useCallback(async (text = input) => {
    if (!text.trim() || isTyping) return

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // 1. Save user message to Supabase
    const { data: savedUser } = await supabase
      .from('chat_messages')
      .insert({ role: 'user', content: text })
      .select()
      .single()

    if (savedUser) {
      setMessages(prev => prev.map(m => m.id === userMsg.id ? {
        ...m,
        id: savedUser.id,
        timestamp: new Date(savedUser.created_at),
      } : m))
    }

    // 2. Build recent history for context (last 10 messages)
    // Note: we use the messages param passed via closure from useCallback
    const recentHistory = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
      ...(m.agent && { agent: m.agent }),
    }))

    // 3. Call n8n chat webhook
    const { data: responseData, error: chatError } = await callChat(text, recentHistory)

    let assistantContent = ''
    if (chatError) {
      assistantContent = `Error: ${chatError}`
    } else if (responseData) {
      assistantContent = responseData.content || responseData.message || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData))
    } else {
      assistantContent = 'No response received from agent.'
    }

    // 4. Save assistant response to Supabase
    const { data: savedAssistant } = await supabase
      .from('chat_messages')
      .insert({ role: 'assistant', agent: 'Sabbath', content: assistantContent })
      .select()
      .single()

    // 5. Append assistant message to UI
    const assistantMsg = {
      id: savedAssistant?.id || `temp-assistant-${Date.now()}`,
      role: 'assistant',
      agent: 'Sabbath',
      content: assistantContent,
      timestamp: savedAssistant?.created_at ? new Date(savedAssistant.created_at) : new Date(),
    }

    setMessages(prev => [...prev, assistantMsg])
    setIsTyping(false)
  }, [input, isTyping, messages, callChat])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-12 flex items-center px-6 border-b border-white/10 bg-zinc-900">
        <div>
          <h2 className="text-[15px] font-semibold text-white">
            Nerve Center chat
          </h2>
          <p className="text-[11px] text-zinc-500">Claude API via n8n</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-[#5DCAA5]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Loading history...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm mb-1">No messages yet</p>
              <p className="text-xs text-zinc-600">Start a conversation with Nerve Center</p>
            </div>
          ) : (
            messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.role === 'user'}
                agent={message.agent}
              />
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-bl-md bg-zinc-900 border border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex-shrink-0 px-4 pb-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-zinc-600 flex-shrink-0">Quick:</span>
            {QUICK_ACTIONS.map(({ label, icon: Icon, prompt }) => (
              <button
                key={label}
                onClick={() => handleSend(prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-zinc-400 hover:border-[#5DCAA5]/50 hover:text-[#5DCAA5] transition-colors whitespace-nowrap bg-zinc-900"
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#5DCAA5]/50 transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Message Nerve Center..."
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm text-white placeholder-zinc-600 focus:outline-none max-h-32"
              style={{ minHeight: '24px', height: 'auto' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 p-2 rounded-lg bg-[#5DCAA5] text-white hover:bg-[#4DB892] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatView
