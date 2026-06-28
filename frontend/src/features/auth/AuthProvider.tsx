import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import api from '../../services/api';
import { auth, requestNotificationPermission, onForegroundMessage } from '../../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_MOCK_AUTH === 'true') {
      setCurrentUser({ uid: 'mock-user-123', email: 'test@example.com', displayName: 'Mock User', getIdToken: async () => 'mock-token' } as any);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        setIsAuthModalOpen(false); // Close modal on successful login
        try {
          const token = await requestNotificationPermission();
          if (token) {
            await api.put('/api/users/fcm-token', { fcmToken: token });
          }
          
          // Start listening for foreground messages
          onForegroundMessage();
        } catch (err) {
          console.error('Failed to setup FCM after login:', err);
        }
      }
    });

    const handleUnauthorized = () => {
      setIsAuthModalOpen(true);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      unsubscribe();
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false)
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
