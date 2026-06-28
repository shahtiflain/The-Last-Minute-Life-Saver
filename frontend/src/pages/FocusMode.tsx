import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Target as TargetIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { Card, CardContent } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Link } from 'react-router-dom';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function FocusMode() {
  const { data: tasks } = useTasks();
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const activeTasks = tasks?.filter(t => t.status !== 'COMPLETED') || [];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        // Could play a sound here
      } else {
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  };
  
  const switchMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    setTimeLeft(!isBreak ? BREAK_TIME : WORK_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate circle stroke based on progress
  const totalTime = isBreak ? BREAK_TIME : WORK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col -m-6 p-6 bg-[#0a0a0c] text-white overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] mix-blend-screen transition-colors duration-1000 ${isBreak ? 'bg-success/10' : 'bg-primary/10'}`} />
        <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen transition-colors duration-1000 ${isBreak ? 'bg-teal-500/10' : 'bg-secondary/10'}`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-12 pt-4">
          <Link to="/" className="flex items-center gap-2 text-text-tertiary hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Exit Focus Mode</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { if(isBreak) switchMode(); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!isBreak ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)]' : 'bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10'}`}
            >
              Focus (25m)
            </button>
            <button 
              onClick={() => { if(!isBreak) switchMode(); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${isBreak ? 'bg-success text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10'}`}
            >
              Break (5m)
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 pb-20">
          
          {/* Timer Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isBreak ? 'bg-success' : 'bg-primary'}`} />
              
              {/* SVG Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-xl">
                <circle
                  className="text-white/5"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="170"
                  cy="170"
                />
                <circle
                  className={`transition-colors duration-500 ${isBreak ? 'text-success' : 'text-primary'}`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="170"
                  cy="170"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                />
              </svg>

              {/* Time Display */}
              <div className="absolute flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${minutes}:${seconds}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="text-[6rem] font-black tracking-tighter tabular-nums leading-none drop-shadow-lg"
                  >
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </motion.div>
                </AnimatePresence>
                <div className={`mt-6 text-sm font-semibold tracking-widest uppercase flex items-center gap-2 ${isBreak ? 'text-success' : 'text-primary'}`}>
                  {isBreak ? <Coffee className="w-4 h-4" /> : <TargetIcon className="w-4 h-4" />}
                  {isBreak ? 'Break Time' : 'Deep Work'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-16">
              <button 
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 ${isActive ? 'bg-white/10 text-white hover:bg-white/20' : (isBreak ? 'bg-success text-white hover:bg-success/90 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)]')}`}
              >
                {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
              
              <button 
                onClick={resetTimer}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-text-tertiary hover:bg-white/10 hover:text-white transition-all shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Task Selection */}
          <div className="w-full max-w-sm mt-12 lg:mt-0">
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <TargetIcon className="w-5 h-5 text-primary" />
                  Target Focus
                </h3>
                
                {activeTasks.length > 0 ? (
                  <div className="space-y-6">
                    <Select 
                      className="w-full bg-black/40 border-white/10 text-white h-12 rounded-xl focus:border-primary/50"
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                      <option value="" className="bg-[#1a1a1c]">Select a task to focus on...</option>
                      {activeTasks.map(task => (
                        <option key={task._id} value={task._id} className="bg-[#1a1a1c]">
                          {task.title}
                        </option>
                      ))}
                    </Select>
                    
                    <AnimatePresence>
                      {selectedTaskId && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, height: 0 }} 
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
                        >
                          <p className="text-xs text-primary/80 font-bold uppercase tracking-wider mb-2">Current Mission</p>
                          <p className="font-semibold text-lg leading-tight text-white/90">{activeTasks.find(t => t._id === selectedTaskId)?.title}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-success" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm mt-1">Enjoy your free time.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
