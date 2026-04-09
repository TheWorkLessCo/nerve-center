import { Component } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] px-4">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E24B4A]/10 mb-6">
              <AlertTriangle size={32} className="text-[#E24B4A]" />
            </div>
            <h1 className="text-xl font-bold text-[#1a1a1a] dark:text-[#fafafa] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#666666] dark:text-[#888888] mb-6">
              An unexpected error occurred. Your data is safe — please reload to continue.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-lg bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] text-left">
                <p className="text-xs font-mono text-[#E24B4A] break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5DCAA5] text-white rounded-lg hover:bg-[#4ab890] transition-colors font-medium text-sm"
            >
              <RefreshCw size={15} />
              Reload Nerve Center
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
