import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Calendar, 
  Target, 
  Zap, 
  Info 
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { useHabits } from '../context/HabitContext';
import { getPastDays } from '../utils/dateUtils';

interface DataPoint {
  day: number;
  label: string;
  compoundingBetter: number;
  userProjected: number;
  linearExpectation: number;
  compoundingWorse: number;
  valleyGap?: number;
}

export const PlateauCalculator: React.FC = () => {
  const { state } = useHabits();
  const [days, setDays] = useState<number>(365);
  const [dailyRatePercent, setDailyRatePercent] = useState<number>(1.0); // 1%
  const [viewMode, setViewMode] = useState<'compounding' | 'historical'>('compounding');

  const rate = dailyRatePercent / 100;

  // Calculate user empirical adherence from the past 28 days
  const past28 = useMemo(() => getPastDays(28), []);
  const activeHabits = useMemo(() => state.habits.filter(h => !h.archived), [state.habits]);
  
  const adherenceStats = useMemo(() => {
    if (activeHabits.length === 0) return { overallRate: 0.8, dailyCounts: [] };
    
    let totalPossible = activeHabits.length * past28.length;
    let totalCompleted = 0;
    
    const dailyCounts = past28.map((date, idx) => {
      const completedOnDate = activeHabits.filter(h => h.completedDates.includes(date)).length;
      totalCompleted += completedOnDate;
      const pct = Math.round((completedOnDate / activeHabits.length) * 100);
      return {
        day: idx + 1,
        date: date.slice(5), // 'MM-DD'
        completionRate: pct,
        completedCount: completedOnDate,
        totalHabits: activeHabits.length
      };
    });

    const overallRate = totalPossible > 0 ? totalCompleted / totalPossible : 0.85;
    return { overallRate, dailyCounts };
  }, [activeHabits, past28]);

  // Projected user rate: scales the daily improvement based on their real adherence rate
  const userEffectiveDailyRate = rate * adherenceStats.overallRate;

  // Final values
  const betterValue = Math.pow(1 + rate, days);
  const userValue = Math.pow(1 + userEffectiveDailyRate, days);
  const worseValue = Math.pow(Math.max(0.001, 1 - rate), days);

  // Generate Long-Term Chart Data for Recharts
  const { chartData, breakthroughDay } = useMemo(() => {
    const points: DataPoint[] = [];
    const sampleSteps = Math.min(days, 60);
    const stepSize = days / sampleSteps;

    let foundBreakthrough: number | null = null;

    for (let i = 0; i <= sampleSteps; i++) {
      const d = Math.round(i * stepSize);
      const bVal = Number(Math.pow(1 + rate, d).toFixed(2));
      const uVal = Number(Math.pow(1 + userEffectiveDailyRate, d).toFixed(2));
      const wVal = Number(Math.pow(Math.max(0.001, 1 - rate), d).toFixed(2));
      // Linear expectation standard curve: What people intuitively expect
      const expVal = Number((1 + (d / days) * (betterValue * 0.38)).toFixed(2));

      if (foundBreakthrough === null && d > 15 && bVal >= expVal) {
        foundBreakthrough = d;
      }

      points.push({
        day: d,
        label: `Day ${d}`,
        compoundingBetter: bVal,
        userProjected: uVal,
        linearExpectation: expVal,
        compoundingWorse: wVal,
        valleyGap: expVal > bVal ? Number((expVal - bVal).toFixed(2)) : 0
      });
    }

    return {
      chartData: points,
      breakthroughDay: foundBreakthrough || Math.round(days * 0.6)
    };
  }, [days, rate, userEffectiveDailyRate, betterValue]);

  // Custom Recharts Tooltip for Long-term Trajectory
  const CustomTrajectoryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DataPoint;
      const isValley = data.day < breakthroughDay;

      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[210px] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white font-mono">{data.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              isValley ? 'bg-indigo-500/15 text-indigo-300' : 'bg-emerald-500/15 text-emerald-300'
            }`}>
              {isValley ? 'Valley of Disappointment' : 'Breakthrough Potential'}
            </span>
          </div>

          <div className="space-y-1 pt-1 font-mono">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                1% Better Compounding:
              </span>
              <span className="font-bold">{data.compoundingBetter}x</span>
            </div>

            <div className="flex items-center justify-between text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Your Actual Pace:
              </span>
              <span className="font-bold">{data.userProjected}x</span>
            </div>

            <div className="flex items-center justify-between text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Linear Expectation:
              </span>
              <span className="font-bold">{data.linearExpectation}x</span>
            </div>

            <div className="flex items-center justify-between text-rose-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                1% Decline (Neglect):
              </span>
              <span className="font-bold">{data.compoundingWorse}x</span>
            </div>
          </div>

          {isValley && (
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 italic">
              Results lag work in early stages. Consistency stores latent power.
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for 28-day adherence
  const CustomAdherenceTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl text-xs space-y-1">
          <div className="font-bold text-white font-mono">Date: {data.date}</div>
          <div className="text-emerald-400 font-semibold">
            Completed: {data.completedCount} / {data.totalHabits} ({data.completionRate}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>The Plateau of Latent Potential & Performance Analytics</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              "Habits do not add up. They compound."
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you improve by 1% each day for a year, you end up <strong>37.78 times better</strong>. In the early stages, progress is imperceptible—this is the <em>Valley of Disappointment</em> where habits feel ineffective before breaking through.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('compounding')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'compounding'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Compounding Trajectory</span>
            </button>
            <button
              onClick={() => setViewMode('historical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'historical'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Historical Adherence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Workspace */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        
        {/* Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Time Horizon (Days):</span>
              <span className="font-mono text-indigo-400 font-bold">{days} days ({Math.round(days / 30)} months)</span>
            </div>
            <input
              type="range"
              min={30}
              max={730}
              step={5}
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>30 days</span>
              <span>1 Year (365d)</span>
              <span>2 Years (730d)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Daily Delta Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">{dailyRatePercent.toFixed(1)}% / day</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={dailyRatePercent}
              onChange={e => setDailyRatePercent(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.2% micro-gain</span>
              <span>1.0% (Classic)</span>
              <span>2.5% aggressive</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>Theoretical {dailyRatePercent}% Compounding</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {betterValue.toFixed(2)}x
            </div>
            <p className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
              (1 + {rate.toFixed(3)})<sup>{days}</sup>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Your Adherence Pace ({Math.round(adherenceStats.overallRate * 100)}%)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {userValue.toFixed(2)}x
            </div>
            <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
              Projected over {days} days
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowDownRight className="w-4 h-4" />
              <span>1% Neglect Decline</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {worseValue.toFixed(2)}x
            </div>
            <p className="text-[11px] text-rose-300/80 font-mono mt-0.5">
              (1 - {rate.toFixed(3)})<sup>{days}</sup>
            </p>
          </div>
        </div>

        {/* RECHARTS PERFORMANCE GRAPH */}
        {viewMode === 'compounding' ? (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Long-Term Compounding Performance Trajectory (Recharts)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Interactive performance visualization mapping exponential gains vs linear expectation.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  1% Better
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Your Pace
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  Linear Expectation
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  1% Worse
                </span>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="betterGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={d => `Day ${d}`}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={v => `${v}x`}
                    domain={[0, 'auto']}
                  />

                  <Tooltip content={<CustomTrajectoryTooltip />} />

                  {/* Reference line marking Breakthrough Threshold */}
                  <ReferenceLine
                    x={breakthroughDay}
                    stroke="#6366f1"
                    strokeDasharray="4 4"
                    label={{
                      value: `Breakthrough: Day ${breakthroughDay}`,
                      fill: '#818cf8',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />

                  {/* 1% Worse decay line */}
                  <Line
                    type="monotone"
                    dataKey="compoundingWorse"
                    name="1% Worse (Neglect)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                  />

                  {/* Linear expectation dashed line */}
                  <Line
                    type="monotone"
                    dataKey="linearExpectation"
                    name="Linear Expectation"
                    stroke="#818cf8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />

                  {/* Actual user projected pace area */}
                  <Area
                    type="monotone"
                    dataKey="userProjected"
                    name="Your Actual Pace"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#userGradient)"
                  />

                  {/* Ideal 1% better compounding area */}
                  <Area
                    type="monotone"
                    dataKey="compoundingBetter"
                    name="1% Better Compounding"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#betterGradient)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 gap-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  <strong>Breakthrough Day ({breakthroughDay}d):</strong> Point where latent compounding overtakes linear effort.
                </span>
              </span>
              <span className="italic text-slate-500">
                Formula: P(t) = (1 ± r)ᵗ
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>28-Day Empirical Habit Adherence (% Daily Completed)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Live adherence rate across your active habit engines over the past 4 weeks.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                Average Adherence: {Math.round(adherenceStats.overallRate * 100)}%
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={adherenceStats.dailyCounts}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip content={<CustomAdherenceTooltip />} />
                  <ReferenceLine
                    y={Math.round(adherenceStats.overallRate * 100)}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target Baseline: ${Math.round(adherenceStats.overallRate * 100)}%`,
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adherenceGrad)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span>Maintaining ≥ 80% adherence triggers compound habit reinforcement.</span>
              <span className="font-mono text-emerald-400 font-semibold">Active Habits: {activeHabits.length}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
