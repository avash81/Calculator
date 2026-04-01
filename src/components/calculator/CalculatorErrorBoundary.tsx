'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  calculatorName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CalculatorErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calculator Error:', error, errorInfo);
    // Log to error tracking service (Sentry, LogRocket, etc. - currently just console)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
            
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
                {this.props.calculatorName ? `${this.props.calculatorName} Error` : 'Calculation Error'}
              </h2>
              
              <p className="text-red-700 dark:text-red-400 mb-4">
                {this.state.error?.message || 'An unexpected error occurred during calculation.'}
              </p>

              <details className="mb-4 cursor-pointer">
                <summary className="text-sm text-red-600 dark:text-red-400 hover:underline">
                  Technical Details
                </summary>
                <pre className="mt-2 bg-red-100 dark:bg-red-900/40 p-3 rounded text-xs overflow-auto max-h-32 text-red-800 dark:text-red-300">
                  {this.state.error?.stack}
                </pre>
              </details>

              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/calculator'}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-bold rounded-lg transition-colors"
                >
                  Back to Calculators
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
