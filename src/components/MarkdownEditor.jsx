import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Save, Eye, Edit2, Upload } from 'lucide-react'

function MarkdownEditor({ initialValue = '', onSave, onChange, filename = 'untitled.md', modified = false, status = 'synced', onPush }) {
  const [content, setContent] = useState(initialValue)
  const [isPreview, setIsPreview] = useState(false)

  const handleChange = (newContent) => {
    setContent(newContent)
    if (onChange) onChange(newContent)
  }

  const handleSave = () => {
    if (onSave) onSave(content)
  }

  const statusLabel = {
    synced: { label: 'synced', className: 'bg-[#5DCAA5]/20 text-[#5DCAA5]' },
    modified: { label: 'modified', className: 'bg-amber-500/20 text-amber-500' },
    saving: { label: 'saving...', className: 'bg-zinc-500/20 text-zinc-400' },
    error: { label: 'error', className: 'bg-red-500/20 text-red-500' },
  }[status] || { label: 'synced', className: 'bg-[#5DCAA5]/20 text-[#5DCAA5]' }

  return (
    <div className="flex flex-col h-full rounded-xl border border-white/10 bg-zinc-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800 border-b border-white/10">
        {/* Left: file name + status */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[15px] font-medium text-white truncate">
            {filename}
          </span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded ${statusLabel.className} flex-shrink-0`}>
            {statusLabel.label}
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          <button
            onClick={() => setIsPreview(false)}
            className={`p-1.5 rounded-lg transition-colors ${
              !isPreview
                ? 'bg-[#5DCAA5]/10 text-[#5DCAA5]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`p-1.5 rounded-lg transition-colors ${
              isPreview
                ? 'bg-[#5DCAA5]/10 text-[#5DCAA5]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Preview"
          >
            <Eye size={15} />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5DCAA5] text-white rounded-lg hover:bg-[#4DB892] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Save size={14} />
            Save
          </button>

          {onPush && (
            <button
              onClick={onPush}
              disabled={status === 'saving'}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-lg hover:bg-zinc-700 text-zinc-300 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              <Upload size={14} />
              Push
            </button>
          )}
        </div>
      </div>

      {/* Editor / Preview area */}
      <div className="flex-1 overflow-auto bg-zinc-950">
        {isPreview ? (
          <div className="p-6 max-w-3xl">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm prose-invert max-w-none"
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={e => handleChange(e.target.value)}
            className="w-full h-full p-6 bg-transparent resize-none focus:outline-none font-mono text-[13px] leading-[1.7] text-zinc-300 placeholder-zinc-600"
            placeholder="Write markdown here..."
            style={{ minHeight: '100%' }}
          />
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
