import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center p-4 bg-bg-base">
          <Card className="max-w-md w-full border-danger/50 bg-danger/5">
            <CardHeader>
              <CardTitle className="text-danger">Application Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary mb-6">
                {this.state.error?.message || 'An unexpected error occurred and the application crashed.'}
              </p>
              <Button onClick={() => window.location.reload()} variant="primary" className="w-full">
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
