import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-primary/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-surface/80 backdrop-blur-md border-b border-border-color">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#383838] to-[#1E1E1E] dark:from-[#3a3a3a] dark:to-[#222222] rounded-lg flex items-center justify-center shadow-sm border border-[#444]">
              <span className="text-white font-bold text-lg font-serif leading-none">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Hustlr</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it Works</a>
            <a href="#resources" className="hover:text-text-primary transition-colors">Resources</a>
            <a href="#about" className="hover:text-text-primary transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="hidden sm:flex">
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
              Explore Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Introducing Hustlr AI
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Work at the speed of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                thought.
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              The premium, AI-powered workspace that plans your day, organizes your tasks, and keeps you focused on what actually matters.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base" onClick={() => navigate('/dashboard')}>
                Start Exploring
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base">
                View GitHub
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Product Preview Mockup */}
        <motion.div 
          className="max-w-6xl mx-auto mt-24 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="rounded-2xl border border-border-color bg-bg-surface shadow-2xl overflow-hidden aspect-[16/10] relative">
            {/* Mockup Header */}
            <div className="h-12 border-b border-border-color flex items-center px-4 gap-2 bg-bg-surface-hover/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
            </div>
            {/* Mockup Body */}
            <div className="absolute inset-0 top-12 bg-bg-base p-8">
              <div className="flex gap-8 h-full">
                {/* Sidebar mock */}
                <div className="w-48 h-full flex flex-col gap-4 hidden sm:flex">
                  <div className="w-24 h-4 bg-border-color rounded-md mb-4" />
                  <div className="w-full h-8 bg-border-color/50 rounded-md" />
                  <div className="w-3/4 h-8 bg-border-color/30 rounded-md" />
                  <div className="w-5/6 h-8 bg-border-color/30 rounded-md" />
                </div>
                {/* Dashboard mock */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="w-48 h-8 bg-border-color rounded-md" />
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 h-48 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                    <div className="h-48 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="h-32 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                    <div className="h-32 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                    <div className="h-32 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                    <div className="h-32 bg-bg-surface border border-border-color rounded-xl shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
