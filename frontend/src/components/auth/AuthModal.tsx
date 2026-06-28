import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../features/auth/AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({ 
  isOpen, 
  onClose,
  title = "Welcome to Hustlr",
  subtitle = "Sign in to save your workspace, synchronize across your devices, connect Google Calendar and unlock your personal AI productivity assistant."
}: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  if (currentUser) {
    if (isOpen) onClose();
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
      provider.setCustomParameters({
        prompt: 'consent',
        access_type: 'offline'
      });
      
      if (!auth) throw new Error('Firebase Auth not initialized');
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential && credential.accessToken) {
        localStorage.setItem('google_oauth_token', credential.accessToken);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#383838] to-[#1E1E1E] dark:from-[#3a3a3a] dark:to-[#222222] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] mb-6 border border-[#444]">
          <span className="text-white font-bold text-3xl font-serif">H</span>
        </div>
        <p className="text-center text-text-secondary mb-8 text-sm leading-relaxed max-w-sm">
          {subtitle}
        </p>
        
        {error && <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm text-center w-full">{error}</div>}
        
        <Button
          className="w-full flex items-center justify-center gap-3 h-12 text-base shadow-sm"
          variant="secondary"
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>
        <p className="text-center text-text-tertiary mt-6 text-xs">
          By continuing, you agree to Hustlr's Terms of Service and Privacy Policy.
        </p>
      </div>
    </Dialog>
  );
}
