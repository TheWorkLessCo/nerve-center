import { useState, useEffect, useRef } from 'react'
import DocCard from '../components/DocCard'
import { Search, Plus, FileText, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useShortcuts from '../hooks/useShortcuts'

const PROJECTS = ['All', 'DWB Ops', 'TWC Ops', 'Onboarder', 'Selah', 'System']

function DocsView() {
  const [docs, setDocs] = useState([])
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProject, setNewProject] = useState('DWB Ops')
  const searchRef = useRef(null)

  // Keyboard shortcuts
  useShortcuts({
    search: () => searchRef.current?.focus(),
    escape: () => { setSelectedDoc(null); setIsEditing(false); setShowNewForm(false) },
  })

  // Fetch docs on mount
  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (!error && data) {
        setDocs(data.map(d => ({
          id: d.id,
          title: d.title,
          content: d.content,
          project: d.project,
          description: d.description || '',
          updatedAt: new Date(d.updated_at),
        })))
      }
      setLoading(false)
    }
    fetchDocs()
  }, [])

  // Client-side search
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase())
    const matchesProject = selectedProject === 'All' || doc.project === selectedProject
    return matchesSearch && matchesProject
  })

  const handleDocClick = (doc) => {
    setSelectedDoc(doc)
    setEditContent(doc.content || '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!selectedDoc) return
    setSaving(true)
    const { error } = await supabase
      .from('docs')
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq('id', selectedDoc.id)

    if (!error) {
      setDocs(prev => prev.map(d =>
        d.id === selectedDoc.id
          ? { ...d, content: editContent, updatedAt: new Date() }
          : d
      ))
      setSelectedDoc(prev => ({ ...prev, content: editContent, updatedAt: new Date() }))
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    const { data, error } = await supabase
      .from('docs')
      .insert({ title: newTitle, project: newProject, content: '', description: '' })
      .select()
      .single()

    if (!error && data) {
      const newDoc = {
        id: data.id,
        title: data.title,
        content: data.content,
        project: data.project,
        description: data.description || '',
        updatedAt: new Date(data.updated_at),
      }
      setDocs(prev => [newDoc, ...prev])
      setShowNewForm(false)
      setNewTitle('')
      setNewProject('DWB Ops')
      setSelectedDoc(newDoc)
      setEditContent('')
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10 bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-white">
            Docs
          </h2>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5DCAA5] text-white rounded-lg hover:bg-[#4DB892] transition-colors text-xs font-medium"
          >
            <Plus size={13} />
            New Doc
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search docs..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#5DCAA5]/50 transition-colors"
          />
        </div>

        {/* Project filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PROJECTS.map(project => (
            <button
              key={project}
              onClick={() => setSelectedProject(project)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedProject === project
                  ? 'bg-[#5DCAA5] text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {project}
            </button>
          ))}
        </div>
      </div>

      {/* Body: docs grid + editor panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: docs list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* New doc form */}
          {showNewForm && (
            <div className="mb-4 p-4 border border-[#5DCAA5]/30 rounded-xl bg-zinc-900/50">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Doc title..."
                className="w-full mb-2 px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#5DCAA5]/50"
                autoFocus
              />
              <div className="flex items-center gap-2 mb-2">
                {PROJECTS.slice(1).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewProject(p)}
                    className={`px-2 py-1 rounded text-xs ${
                      newProject === p
                        ? 'bg-[#5DCAA5] text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="px-3 py-1.5 bg-[#5DCAA5] text-white rounded-lg text-xs font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => { setShowNewForm(false); setNewTitle('') }}
                  className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-zinc-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <FileText size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No docs found</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {filteredDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => handleDocClick(doc)}
                  className="cursor-pointer"
                >
                  <DocCard doc={doc} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: doc editor panel */}
        {selectedDoc && (
          <div className="w-[480px] flex-shrink-0 border-l border-white/10 flex flex-col overflow-hidden bg-zinc-950">
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-white truncate">
                  {selectedDoc.title}
                </span>
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[11px] bg-[#5DCAA5]/10 text-[#5DCAA5]">
                  {selectedDoc.project}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-2 py-1 bg-[#5DCAA5] text-white rounded-lg text-xs font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setEditContent(selectedDoc.content || '') }}
                      className="px-2 py-1 border border-white/10 rounded-lg text-xs text-zinc-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-2 py-1 border border-white/10 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => { setSelectedDoc(null); setIsEditing(false) }}
                  className="p-1 rounded hover:bg-zinc-800"
                >
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Editor / preview */}
            <div className="flex-1 overflow-auto">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-[13px] leading-[1.7] text-zinc-300 placeholder-zinc-600"
                  placeholder="Write markdown here..."
                  style={{ minHeight: '100%' }}
                />
              ) : (
                <div className="p-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm prose-invert max-w-none"
                  >
                    {selectedDoc.content || '_No content yet. Click Edit to add content._'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocsView
