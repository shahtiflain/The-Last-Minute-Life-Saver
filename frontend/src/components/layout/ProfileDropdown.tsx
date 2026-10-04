import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../../config/firebase';
import { useAuth } from '../../features/auth/AuthProvider';
import { Link } from 'react-router-dom';

export function ProfileDropdown() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    // Close on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  if (!currentUser) return null;

  const initials = currentUser.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : currentUser.email?.charAt(0).toUpperCase() || 'U';

  const avatarUrl = currentUser.photoURL || `https://ui-avatars.com/api/?name=${initials}&background=random`;

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full transition-all"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <img 
            src={avatarUrl}
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-border-color object-cover"
          />
        </div>
        <ChevronDown className="w-4 h-4 text-text-tertiary" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-[14px] w-[320px] bg-white dark:bg-[#111317] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] z-50 overflow-hidden flex flex-col p-[20px] gap-[14px] origin-top-right"
          >
            {/* Section 1: User Info */}
            <div className="flex items-center gap-3 pb-1">
              <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-semibold text-text-primary truncate">
                    {currentUser.displayName || 'User'}
                  </p>

                </div>
                <p className="text-[13px] text-text-tertiary truncate">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[12px] font-medium text-text-secondary">Online</span>
                </div>
              </div>
            </div>

            {/* Section 2: Menu Items */}
            <div className="flex flex-col gap-0.5 pt-1 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
              <MenuItem icon={<UserIcon className="w-4 h-4" />} label="Profile" to="/profile" onClick={() => setIsOpen(false)} />
              <MenuItem icon={<Settings className="w-4 h-4" />} label="Settings" to="/settings" onClick={() => setIsOpen(false)} />
            </div>

            {/* Section 3: Logout */}
            <div className="pt-1 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-danger hover:bg-danger/10 transition-colors duration-150 rounded-[10px] group focus:outline-none focus:ring-2 focus:ring-danger/50"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ icon, label, to, onClick }: { icon: React.ReactNode, label: string, to: string, onClick?: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150 rounded-[10px] group focus:outline-none focus:ring-2 focus:ring-border-highlight"
    >
      <div className="text-text-tertiary group-hover:text-text-primary group-hover:scale-105 transition-all duration-150">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
