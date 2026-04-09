import { useState, useEffect, useCallback } from 'react'
import FileTree from '../components/FileTree'
import MarkdownEditor from '../components/MarkdownEditor'
import useN8n from '../hooks/useN8n'
import useShortcuts from '../hooks/useShortcuts'
import { FolderOpen, Plus } from 'lucide-react'
import { MOCK_MEMORY_FILES } from '../lib/constants'

function MemoryView() {
  const { callMemoryList, callMemoryRead, callMemoryWrite, loading: n8nLoading } = useN8n()

  const [files, setFiles] = useState({ agents: [], system: [] })
  const [selectedFile, setSelectedFile] = useState(null)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('synced') // 'synced' | 'modified' | 'saving' | 'error'
  const [loadError, setLoadError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Keyboard shortcuts
  useShortcuts({
    save: () => status === 'modified' && handleSave(content),
    escape: () => {},
  })

  // Load file list on mount
  useEffect(() => {
    const loadFiles = async () => {
      setLoadError(null)
      const { data, error } = await callMemoryList()
      if (error) {
        // Fall back to mock data when n8n is not available
        const mockAgents = MOCK_MEMORY_FILES.filter(f => f.path.startsWith('Agents/'))
        const mockSystem = MOCK_MEMORY_FILES.filter(f => f.path.startsWith('System/'))
        setFiles({ agents: mockAgents, system: mockSystem })
        setLoadError(null)
        setLoading(false)
        return
      }
      if (data) {
        if (Array.isArray(data)) {
          const agents = data.filter(f => f.path?.startsWith('Agents/') || f.directory === 'Agents')
          const system = data.filter(f => f.path?.startsWith('System/') || f.directory === 'System')
          setFiles({ agents, system })
        } else if (data.agents || data.system) {
          setFiles({ agents: data.agents || [], system: data.system || [] })
        }
      }
      setLoading(false)
    }
    loadFiles()
  }, [])

  // Flatten files for FileTree
  const flatFiles = [...files.agents, ...files.system]

  // Load file content when selected
  const handleSelect = useCallback(async (file) => {
    if (selectedFile?.path === file.path) return
    setSelectedFile(file)
    setStatus('synced')
    setContent('')

    const { data, error } = await callMemoryRead(file.name, file.directory || file.path.split('/')[0])
    if (error) {
      // Fall back to mock content
      const mockFile = MOCK_MEMORY_FILES.find(f => f.path === file.path)
      setContent(mockFile?.content || `[Error loading file: ${error}]`)
      setStatus('synced')
      return
    }
    setContent(typeof data === 'string' ? data : (data?.content || ''))
    setStatus('synced')
  }, [selectedFile, callMemoryRead])

  const handleChange = useCallback((newContent) => {
    setContent(newContent)
    setStatus('modified')
  }, [])

  const handleSave = useCallback(async (contentToSave) => {
    if (!selectedFile) return
    setStatus('saving')
    const { error } = await callMemoryWrite(
      selectedFile.name,
      selectedFile.directory || selectedFile.path.split('/')[0],
      contentToSave
    )
    if (error) {
      setStatus('error')
    } else {
      setStatus('synced')
    }
  }, [selectedFile, callMemoryWrite])

  const handlePush = useCallback(() => {
    handleSave(content)
  }, [content, handleSave])

  const modified = status === 'modified'

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel: File tree */}
      <aside className="w-[220px] flex-shrink-0 border-r border-white/10 bg-zinc-900 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-white/10 flex-shrink-0">
          <FolderOpen size={15} className="mr-2 text-[#5DCAA5]" />
          <span className="text-sm font-semibold text-white">
            Memory files
          </span>
          <button
            className="ml-auto p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            title="New file"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto py-2">
          {loadError ? (
            <div className="px-3 py-2 text-xs text-red-500">
              Failed to load files
            </div>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <FileTree
              files={flatFiles}
              selectedPath={selectedFile?.path}
              onSelect={handleSelect}
            />
          )}
        </div>
      </aside>

      {/* Right panel: Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden p-4">
          {selectedFile ? (
            <MarkdownEditor
              initialValue={content}
              filename={selectedFile.name || 'untitled.md'}
              modified={modified}
              status={status}
              onSave={handleSave}
              onPush={handlePush}
              onChange={handleChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900">
              <div className="text-center text-zinc-500">
                <FolderOpen size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a file from the tree to edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemoryView
