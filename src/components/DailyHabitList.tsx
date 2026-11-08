import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Filter, 
  Search 
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from './HabitCard';
import { Habit, HabitCategory, TimeOfDay } from '../types/habits';
import { getTodayStr, formatFriendlyDate, parseISODate, formatDateToISO } from '../utils/dateUtils';

interface DailyHabitListProps {
  onOpenNewHabitModal: () => void;
  onEditHabit: (habit: Habit) => void;
  onOpenContract: (habit: Habit) => void;
}

const CATEGORIES: { id: HabitCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Routines' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'health', label: 'Physical Health' },
  { id: 'mindset', label: 'Mindset & Stoicism' },
  { id: 'learning', label: 'Learning' },
  { id: 'creativity', label: 'Craft & Creativity' }
];

const TIME_BLOCKS: { id: TimeOfDay; title: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: 'morning', title: 'Morning Prime', icon: Sun, description: 'High-discipline momentum builder' },
  { id: 'afternoon', title: 'Afternoon Flow', icon: Sunset, description: 'Sustained cognitive & physical energy' },
  { id: 'evening', title: 'Evening Wind-Down', icon: Moon, description: 'Environment reset and sleep runway' },
  { id: 'anytime', title: 'Anytime Rituals', icon: Sparkles, description: 'Micro-habits throughout the day' }
];

export const DailyHabitList: React.FC<DailyHabitListProps> = ({
  onOpenNewHabitModal,
  onEditHabit,
  onOpenContract
}) => {
  const { state, dispatch, habitsAtRisk, todayCompletedCount, todayTotalCount } = useHabits();
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const selectedDate = state.selectedDate || getTodayStr();
  const isToday = selectedDate === getTodayStr();

  const handlePrevDay = () => {
    const cur = parseISODate(selectedDate);
    cur.setDate(cur.getDate() - 1);
    dispatch({ type: 'SET_SELECTED_DATE', date: formatDateToISO(cur) });
  };

  const handleNextDay = () => {
    const cur = parseISODate(selectedDate);
    cur.setDate(cur.getDate() + 1);
    dispatch({ type: 'SET_SELECTED_DATE', date: formatDateToISO(cur) });
  };

  const handleToday = () => {
    dispatch({ type: 'SET_SELECTED_DATE', date: getTodayStr() });
  };

  // Filter habits
  const filteredHabits = state.habits.filter(h => {
    if (h.archived) return false;
    if (activeCategory !== 'all' && h.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = h.title.toLowerCase().includes(q);
      const matchDesc = h.description?.toLowerCase().includes(q);
      const matchCue = h.implementationIntention?.behavior?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCue) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Date Bar & Quick Creation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-200">
              {formatFriendlyDate(selectedDate)}
            </span>
            {isToday ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Today
              </span>
            ) : (
              <button
                onClick={handleToday}
                className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 underline ml-1"
              >
                Jump to Today
              </button>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Add Habit */}
        <button
          onClick={onOpenNewHabitModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Atomic Habit</span>
        </button>
      </div>

      {/* Critical Intervention Banner: Never Miss Twice */}
      {isToday && habitsAtRisk.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm sm:text-base font-bold text-rose-200">
                  Law 4 Behavioral Interlock: Never Miss Twice
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  {habitsAtRisk.length} Habit{habitsAtRisk.length > 1 ? 's' : ''} at risk
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <em>"The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows. Missing once is an accident. Missing twice is the start of a new habit."</em> — James Clear
              </p>
              <div className="flex flex-wrap gap-2">
                {habitsAtRisk.map(h => (
                  <div
                    key={h.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 font-medium"
                  >
                    <span>{h.title}</span>
                    <span className="text-[10px] text-rose-400/80">({h.twoMinuteRule?.starterStep || '2-min rule'})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-slate-700/80 text-white border border-slate-600 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cues, habits..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Time-of-day Blocks with Habits */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300 mb-1">No habits found in this view</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or create a new habit anchored to an implementation intention.
          </p>
          <button
            onClick={onOpenNewHabitModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Atomic Habit</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {TIME_BLOCKS.map(block => {
            const blockHabits = filteredHabits.filter(h => h.timeOfDay === block.id);
            if (blockHabits.length === 0) return null;

            const Icon = block.icon;
            const completedCount = blockHabits.filter(h => h.completedDates.includes(selectedDate)).length;

            return (
              <section key={block.id} className="space-y-3">
                {/* Block Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">{block.title}</h3>
                      <p className="text-[11px] text-slate-500">{block.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                    {completedCount} / {blockHabits.length}
                  </span>
                </div>

                {/* Habit Cards in Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {blockHabits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onEdit={onEditHabit}
                      onOpenContract={onOpenContract}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

    </div>
  );
};
