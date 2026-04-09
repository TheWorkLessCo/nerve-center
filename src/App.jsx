import { Routes, Route } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import Layout from './components/Layout'
import LoginView from './views/LoginView'
import MemoryView from './views/MemoryView'
import ChatView from './views/ChatView'
import ActivityView from './views/ActivityView'
import DocsView from './views/DocsView'
import LinksView from './views/LinksView'
import OpenClawView from './views/OpenClawView'
import MissionControlView from './views/MissionControlView'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'

function App() {
  const { user, loading, signInWithPassword, signUp } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-zinc-500">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginView onLogin={signInWithPassword} onSignUp={signUp} />
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<MemoryView />} />
            <Route path="/memory" element={<MemoryView />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/activity" element={<ActivityView />} />
            <Route path="/docs" element={<DocsView />} />
            <Route path="/links" element={<LinksView />} />
            <Route path="/openclaw" element={<OpenClawView />} />
            <Route path="/mission-control" element={<MissionControlView />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
