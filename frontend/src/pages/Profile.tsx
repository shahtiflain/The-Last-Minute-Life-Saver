import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/AuthProvider';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (auth) await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account information.</p>
      </div>

      <Card className="glass-card border-none shadow-sm">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUser && (
            <div className="flex items-center gap-6">
              <div className="relative">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-20 h-20 rounded-2xl shadow-premium object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-premium">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-success rounded-full border-4 border-bg-surface" />
              </div>
              
              <div>
                <p className="font-bold text-xl text-text-primary">{currentUser.displayName || 'User'}</p>
                <p className="text-text-secondary font-medium">{currentUser.email}</p>
                <div className="mt-2 inline-flex px-3 py-1 bg-bg-surface-hover rounded-md border border-border-color/50 text-xs font-semibold text-text-tertiary">
                  Free Plan
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-6 border-t border-border-color/50 flex justify-end">
            <Button variant="danger" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
