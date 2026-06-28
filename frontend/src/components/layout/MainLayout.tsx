import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../ui/CommandPalette';
import { motion } from 'framer-motion';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../features/auth/AuthProvider';
import { AiCopilotWidget } from '../widgets/AiCopilotWidget';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthModalOpen, closeAuthModal, currentUser } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined }}
      >
        <Sidebar />
      </div>

      {/* Main content — adjusts to sidebar width */}
      <motion.div
        layout
        className="flex flex-col flex-1 min-w-0 overflow-hidden relative"
        animate={{ marginLeft: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        
        {/* Demo Mode Banner */}
        {!currentUser && (
          <div className="bg-bg-surface-hover/80 backdrop-blur-sm border-b border-border-color py-1.5 px-4 text-center text-xs font-medium text-text-secondary flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Demo Mode — Your changes are temporary.
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 premium-scrollbar">
          <Outlet />
        </main>
      </motion.div>

      <CommandPalette />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <AiCopilotWidget />
    </div>
  );
}
