import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Flame, 
  Award, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getTodayStr, formatFriendlyDate } from '../utils/dateUtils';

export const Header: React.FC = () => {
  const { 
    state, 
    dispatch, 
    todayCompletedCount, 
    todayTotalCount, 
    totalVotesCast, 
    longestStreakEver 
  } = useHabits();

  const isToday = state.selectedDate === getTodayStr();
  const completionPercentage = todayTotalCount > 0 
    ? Math.round((todayCompletedCount / todayTotalCount) * 100) 
    : 0;

  const handleReset = () => {
    if (window.confirm('Reset all habits and scorecards back to the initial Atomic Habits template?')) {
      dispatch({ type: 'RESET_TO_DEFAULTS' });
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              α
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Anwar habita
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    Behavioral OS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>The 4 Laws of Behavior Change</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-mono text-[11px]">1.01³⁶⁵ = 37.78x</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            
            {/* Daily Execution Progress */}
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-1.5">
              <div className="relative h-8 w-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-slate-700"
                    strokeWidth="2.5"
                    fill="transparent"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-emerald-400 transition-all duration-500"
                    strokeWidth="2.5"
                    strokeDasharray={2 * Math.PI * 13}
                    strokeDashoffset={2 * Math.PI * 13 * (1 - completionPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-emerald-400">
                  {completionPercentage}%
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Today's Execution
                </div>
                <div className="text-xs font-bold text-slate-100 font-mono">
                  {todayCompletedCount} / {todayTotalCount} Done
                </div>
              </div>
            </div>

            {/* Identity Votes Metric */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Identity Votes
                </div>
                <div className="text-xs font-bold text-indigo-300 font-mono">
                  {totalVotesCast} Cast
                </div>
              </div>
            </div>

            {/* Longest Streak Metric */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Peak Streak
                </div>
                <div className="text-xs font-bold text-amber-300 font-mono">
                  {longestStreakEver} Days
                </div>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
              title={state.soundEnabled ? 'Sensory Audio Enabled (Click to Mute)' : 'Audio Muted'}
              className={`p-2 rounded-xl border text-sm transition-colors ${
                state.soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset to Atomic Habits Templates */}
            <button
              onClick={handleReset}
              title="Reset templates"
              className="p-2 rounded-xl border border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
