import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white font-sans flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Terjadi Kesalahan
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Maaf, terjadi kesalahan pada aplikasi. Ini mungkin terkait dengan koneksi database atau konfigurasi Firebase.
            </p>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-red-700 font-medium mb-1">Detail Error:</p>
                <p className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-300/30"
              >
                <RefreshCw size={18} />
                Coba Lagi
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Reload Halaman
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Jika masalah berlanjut, periksa:
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1 text-left">
                <li>• Konfigurasi Firebase di file .env</li>
                <li>• Koneksi internet</li>
                <li>• Firebase project sudah dibuat</li>
                <li>• Firestore database sudah diaktifkan</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary