import { formatDate } from '../utils/formatDate'

function ChatMessage({ message, isOwn, agent }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? 'bg-zinc-800 text-white rounded-br-md'
            : isAssistant
            ? 'bg-zinc-900 border border-white/10 text-zinc-300 rounded-bl-md'
            : 'bg-zinc-800 text-zinc-300 rounded-bl-md'
        }`}
      >
        {/* Agent name badge */}
        {isAssistant && agent && (
          <div className="text-[11px] font-semibold mb-1.5 text-[#5DCAA5] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-pulse" />
            {agent}
          </div>
        )}

        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Timestamp */}
        <div className="text-[11px] mt-1.5 text-zinc-500">
          {formatDate(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
