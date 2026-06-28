import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTasks } from '../hooks/useTasks';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Activity, Target, Zap, Clock } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const COLORS = ['#818CF8', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];

export function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const isLoading = analyticsLoading || tasksLoading;

  // 1. Process Task Category Data for Pie Chart
  const categoryMap: Record<string, number> = {};
  if (tasks) {
    tasks.forEach(t => {
      const cat = t.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
  }
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // 2. Generate Mock Historical Productivity Data ending at current score
  const currentScore = analytics?.productivityScore?.score || 85;
  const historicalData = Array.from({ length: 7 }).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    score: i === 6 ? currentScore : Math.max(0, Math.min(100, currentScore + (Math.random() * 30 - 15)))
  }));

  // 3. Process Task Load per Day based on deadlines
  const daysMap: Record<string, number> = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  if (tasks) {
    tasks.forEach(t => {
      if (t.status !== 'COMPLETED') {
        const d = new Date(t.deadline);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        if (daysMap[dayStr] !== undefined) {
          daysMap[dayStr]++;
        }
      }
    });
  }
  const taskLoadData = Object.keys(daysMap).map(key => ({
    day: key,
    tasks: daysMap[key]
  }));

  // Tooltip Styler
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface border border-border-color/60 backdrop-blur-xl p-3 rounded-xl shadow-2xl">
          <p className="text-text-primary font-semibold text-sm mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="text-sm font-medium" style={{ color: p.color || p.fill }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-full w-full">
      {/* Premium Ambient Background */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] -left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative max-w-[1600px] mx-auto space-y-6 z-10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Analytics & Insights</h1>
            <p className="text-text-secondary mt-1">Visualize your productivity, habits, and task distribution over time.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center"><Spinner /></div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <motion.div variants={item}>
                <Card className="h-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold text-text-secondary">Productivity Score</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary mt-2">{Math.round(currentScore)}<span className="text-lg text-text-tertiary">/100</span></p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-success" />
                      </div>
                      <h3 className="text-sm font-semibold text-text-secondary">Completed Tasks</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary mt-2">{tasks?.filter(t => t.status === 'COMPLETED').length || 0}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <h3 className="text-sm font-semibold text-text-secondary">Pending Workload</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary mt-2">{tasks?.filter(t => t.status !== 'COMPLETED').length || 0}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-secondary" />
                      </div>
                      <h3 className="text-sm font-semibold text-text-secondary">High Risk Deadlines</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary mt-2">{analytics?.deadlineRisk.highRiskCount || 0}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <motion.div variants={item} className="h-[400px]">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Productivity Trend (7 Days)</h3>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                          <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="score" name="Score" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item} className="h-[400px]">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Upcoming Task Load</h3>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={taskLoadData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                          <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} allowDecimals={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                          <Bar dataKey="tasks" name="Tasks Due" fill="#34D399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <motion.div variants={item} className="lg:col-span-1 h-[400px]">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-text-primary mb-2">Category Distribution</h3>
                    <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                      {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-text-tertiary">No category data available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item} className="lg:col-span-2 h-[400px]">
                <Card className="h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 transition-opacity opacity-50 group-hover:opacity-100" />
                  <CardContent className="p-8 flex-1 flex flex-col justify-center items-center text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">AI Deep Analysis Coming Soon</h3>
                    <p className="text-text-secondary max-w-md mx-auto">
                      In the future, your AI Orchestrator will analyze this data to automatically adjust your workflow, suggesting specific days for deep work based on historical completion rates.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
