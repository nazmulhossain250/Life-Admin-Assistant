import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-stone-900 dark:text-white mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-8">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
               <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl text-left overflow-auto text-sm text-stone-500 mb-8 border border-stone-100 dark:border-stone-800">
                  <code>{this.state.error.message}</code>
               </div>
            )}
            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw size={20} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
