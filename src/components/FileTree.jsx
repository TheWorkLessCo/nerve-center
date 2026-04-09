import { File, Folder } from 'lucide-react'

function FileTree({ files, onSelect, selectedPath }) {
  // Group files by top-level directory
  const grouped = {}
  files.forEach(file => {
    const parts = file.path.split('/')
    const dir = parts.length > 1 ? parts[0] : 'root'
    if (!grouped[dir]) grouped[dir] = []
    grouped[dir].push(file)
  })

  return (
    <div className="font-mono text-[13px] text-zinc-400">
      {Object.entries(grouped).map(([dir, dirFiles]) => (
        <div key={dir}>
          {/* Directory header */}
          <div className="flex items-center py-1.5 px-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <Folder size={12} className="mr-2 text-zinc-500 flex-shrink-0" />
            {dir}
          </div>

          {/* Files in directory */}
          {dirFiles.map(file => {
            const isSelected = selectedPath === file.path
            return (
              <div
                key={file.path}
                onClick={() => onSelect && onSelect(file)}
                className={`flex items-center py-1.5 px-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#5DCAA5]/10 border-l-2 border-[#5DCAA5] text-white'
                    : 'border-l-2 border-transparent hover:bg-zinc-800'
                }`}
              >
                <File size={13} className="mr-2 flex-shrink-0 text-zinc-500" />
                <span className="truncate">{file.name}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default FileTree
