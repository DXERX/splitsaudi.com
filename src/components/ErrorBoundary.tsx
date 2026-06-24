import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Split store error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-split-black text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="font-display text-3xl uppercase tracking-wide">Something broke</h1>
            <p className="mt-4 text-sm text-white/60">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-split-yellow text-split-black px-6 py-3 font-bold uppercase tracking-wider"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
