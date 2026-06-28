import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Target, LineChart, Trophy, CheckCircle2, 
  ArrowRight, Brain, Clock, Zap, Code, Globe
} from 'lucide-react';
import customLogo from '../assets/hustler_word_logo_transparent.png';

export function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Global AI Copilot',
      description: 'Chat with your AI assistant from anywhere in the app to instantly schedule tasks, break down complex goals, and get intelligent productivity insights.',
      icon: <Sparkles className="w-6 h-6 text-[#818CF8]" />,
      color: 'bg-[#818CF8]/10 border-[#818CF8]/20'
    },
    {
      title: 'Deep Focus Mode',
      description: 'Enter a distraction-free environment with a built-in Pomodoro timer. Track your deep work sessions and watch your productivity soar.',
      icon: <Target className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Advanced Analytics',
      description: 'Visualize your progress with stunning, real-time charts. Track your task completion rates, habit streaks, and overall productivity score.',
      icon: <LineChart className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Gamified Progression',
      description: 'Earn XP, level up your rank, and unlock unique badges by completing tasks and maintaining your daily habit streaks.',
      icon: <Trophy className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#818CF8]/30 font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-3xl border-b border-white/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 h-24 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <div className="flex items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => window.scrollTo(0,0)}>
              <img src={customLogo} alt="Hustlr" className="h-14 sm:h-16 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center items-center gap-12 text-sm font-bold text-gray-400">
            <a href="#features" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Features</a>
            <a href="#how-it-works" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">How it Works</a>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex text-gray-300 hover:text-white font-bold" onClick={() => navigate('/dashboard')}>
              Sign In
            </Button>
            <Button variant="primary" className="rounded-full shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.6)] font-bold px-6 transition-all" onClick={() => navigate('/dashboard')}>
              Explore Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-48 pb-20 px-6 relative">
        {/* Immersive Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#818CF8]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#818CF8] animate-pulse"></span>
              The next generation of productivity
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              Work at the speed of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-purple-400 drop-shadow-lg">
                thought.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Hustlr combines an intelligent AI Copilot with Deep Focus mechanics and Gamified progression to make work feel like play.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-lg h-14 px-8 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.4)] hover:scale-105 transition-all border border-white" onClick={() => navigate('/dashboard')}>
                Explore Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* High-Fidelity Dashboard Mockup */}
        <motion.div 
          className="max-w-6xl mx-auto mt-32 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {/* Mockup Backglow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#818CF8]/20 to-purple-900/10 blur-[100px] -z-10 rounded-[40px]" />
          
          <div className="rounded-[32px] border border-white/10 bg-[#0a0a0c]/90 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden aspect-[16/10] relative flex flex-col">
            {/* MacOS-style Window Header */}
            <div className="h-14 border-b border-white/10 flex items-center px-6 gap-2 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-white/10 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-white/10 shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-white/10 shadow-inner" />
              </div>
            </div>
            
            {/* Inner Dashboard UI Mockup */}
            <div className="flex-1 flex p-6 gap-6 relative">
              {/* Fake Sidebar */}
              <div className="w-48 flex flex-col gap-3">
                <div className="h-8 bg-white/10 rounded-lg w-2/3 mb-4" />
                <div className="h-10 bg-[#818CF8]/20 border border-[#818CF8]/30 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl mt-auto" />
              </div>
              
              {/* Fake Content Area */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Fake Top Row (Stats) */}
                <div className="grid grid-cols-3 gap-6 h-32">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#818CF8]/20 rounded-full blur-xl" />
                    <div className="h-4 w-1/2 bg-white/20 rounded" />
                    <div className="h-10 w-3/4 bg-white/80 rounded" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="h-4 w-1/2 bg-white/20 rounded" />
                    <div className="h-10 w-3/4 bg-white/80 rounded" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="h-4 w-1/2 bg-white/20 rounded" />
                    <div className="flex gap-2 items-end">
                      <div className="h-10 w-12 bg-emerald-500/80 rounded" />
                      <div className="h-6 w-12 bg-emerald-500/40 rounded" />
                      <div className="h-8 w-12 bg-emerald-500/60 rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Fake Bottom Row (Tasks & Charts) */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                  {/* Task List */}
                  <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="h-6 w-1/3 bg-white/20 rounded mb-2" />
                    <div className="h-16 bg-white/10 rounded-xl border border-white/5 flex items-center px-4 gap-4">
                      <div className="w-5 h-5 rounded border border-white/30" />
                      <div className="h-4 w-1/2 bg-white/40 rounded" />
                    </div>
                    <div className="h-16 bg-[#818CF8]/10 rounded-xl border border-[#818CF8]/30 flex items-center px-4 gap-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#818CF8]" />
                      <div className="w-5 h-5 rounded bg-[#818CF8]/50 border border-[#818CF8]" />
                      <div className="h-4 w-2/3 bg-white/80 rounded" />
                    </div>
                    <div className="h-16 bg-white/10 rounded-xl border border-white/5 flex items-center px-4 gap-4">
                      <div className="w-5 h-5 rounded border border-white/30" />
                      <div className="h-4 w-1/3 bg-white/40 rounded" />
                    </div>
                  </div>
                  
                  {/* Chart/Activity */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center gap-6">
                    <div className="w-40 h-40 rounded-full border-[16px] border-white/10 border-t-[#818CF8] border-r-[#818CF8] animate-spin-slow" />
                    <div className="h-4 w-2/3 bg-white/20 rounded" />
                  </div>
                </div>
              </div>

              {/* Fake AI Copilot Floating Button */}
              <div className="absolute bottom-8 right-8 w-14 h-14 bg-[#818CF8] rounded-full shadow-[0_0_30px_rgba(129,140,248,0.5)] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Everything you need.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We've combined the most powerful productivity techniques into a single, unified workspace. No more context switching.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <img src={customLogo} alt="Hustlr" className="h-10 object-contain" />
          </div>
          <div className="flex gap-6 text-gray-500 font-medium text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
