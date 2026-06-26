import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-bg-base">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-text-primary">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-text-secondary mb-6">Sign in to The Last-Minute Life Saver</p>
          {error && <div className="mb-4 text-danger text-sm text-center">{error}</div>}
          <Button 
            className="w-full" 
            onClick={handleGoogleSignIn} 
            isLoading={isLoading}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
