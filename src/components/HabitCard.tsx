import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Gift, 
  Zap, 
  Edit3, 
  Trash2, 
  FileText 
} from 'lucide-react';
import { Habit } from '../types/habits';
import { useHabits } from '../context/HabitContext';
import { getTodayStr, isAtRiskOfMissingTwice } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onOpenContract?: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onOpenContract }) => {
  const { state, dispatch, identities } = { ...useHabits(), identities: useHabits().state.identities };
  const [expanded, setExpanded] = useState(false);
  const [showTwoMinuteModal, setShowTwoMinuteModal] = useState(false);

  const selectedDate = state.selectedDate || getTodayStr();
  const isCompleted = habit.completedDates.includes(selectedDate);
  const isAtRisk = isAtRiskOfMissingTwice(habit.completedDates) && !isCompleted;

  // Find linked identity
  const identity = identities.find(i => i.id === habit.identityId);

  // Find parent stacked habit if any
  const parentHabit = habit.stackParentHabitId 
    ? state.habits.find(h => h.id === habit.stackParentHabitId) 
    : null;

  const handleToggle = () => {
    dispatch({
      type: 'TOGGLE_HABIT',
      habitId: habit.id,
      date: selectedDate
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete habit "${habit.title}"?`)) {
      dispatch({ type: 'DELETE_HABIT', habitId: habit.id });
    }
  };

  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isCompleted
          ? 'bg-slate-900/60 border-emerald-500/30 shadow-md shadow-emerald-500/5'
          : isAtRisk
          ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-500/5'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      {/* Top accent line */}
      <div 
        className="h-1 w-full" 
        style={{ backgroundColor: habit.color || '#6366f1' }}
      />

      {/* Critical "Never Miss Twice" Banner */}
      {isAtRisk && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span>
              <strong>Never Miss Twice!</strong> You missed yesterday. Complete the 2-minute starter version today to protect your identity.
            </span>
          </div>
          <button
            onClick={() => setShowTwoMinuteModal(true)}
            className="text-[11px] font-semibold underline hover:text-white shrink-0 ml-2"
          >
            Use 2-Min Rule
          </button>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          
          {/* Main Habit Title & Checkbox */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <button
              onClick={handleToggle}
              aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
              className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all transform active:scale-95 shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-800/80 border-slate-600 hover:border-indigo-400 text-transparent'
              }`}
            >
              <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-slate-950' : 'opacity-0'}`} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3
                  className={`text-base font-semibold leading-snug transition-colors ${
                    isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'
                  }`}
                >
                  {habit.title}
                </h3>

                {/* Identity Tag */}
                {identity && (
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1"
                    style={{
                      backgroundColor: `${identity.color}15`,
                      borderColor: `${identity.color}35`,
                      color: identity.color
                    }}
                  >
                    <span>{identity.title}</span>
                  </span>
                )}
              </div>

              {habit.description && (
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                  {habit.description}
                </p>
              )}

              {/* Implementation Intention preview (Law 1) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{habit.implementationIntention?.time || 'Anytime'}</span>
                </span>
                {habit.implementationIntention?.location && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[180px] sm:max-w-[260px]">
                      {habit.implementationIntention.location}
                    </span>
                  </span>
                )}
                {parentHabit && (
                  <span className="flex items-center gap-1 text-indigo-400 font-medium">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Stacked after: {parentHabit.title}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Metrics & Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Counter */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              habit.streak > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                : 'bg-slate-800/60 text-slate-500 border-slate-700/40'
            }`}>
              <Flame className={`w-3.5 h-3.5 ${habit.streak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
              <span>{habit.streak}d</span>
            </div>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              aria-label="Toggle atomic details"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Expandable 4-Laws Behavioral Breakdown */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3.5 text-xs animate-in fade-in duration-200">
            
            {/* 1st Law: Make it Obvious */}
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30">
                  1st Law: Obvious
                </span>
                <span>Implementation Intention</span>
              </div>
              <p className="text-slate-300 italic">
                "I will <strong className="text-white">{habit.implementationIntention?.behavior || habit.title}</strong> at{' '}
                <strong className="text-white">{habit.implementationIntention?.time}</strong> in{' '}
                <strong className="text-white">{habit.implementationIntention?.location}</strong>."
              </p>
            </div>

            {/* 2nd Law: Make it Attractive */}
            {habit.temptationBundle && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30">
                    2nd Law: Attractive
                  </span>
                  <span>Temptation Bundling</span>
                </div>
                <p className="text-slate-300">
                  {habit.temptationBundle}
                </p>
              </div>
            )}

            {/* 3rd Law: Make it Easy (2-Minute Rule) */}
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                    3rd Law: Easy
                  </span>
                  <span>The 2-Minute Gateway Step</span>
                </div>
                <button
                  onClick={() => setShowTwoMinuteModal(true)}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                >
                  View 5-Phase Shaping
                </button>
              </div>
              <p className="text-slate-300 mb-2">
                Starter rep: <strong className="text-emerald-300">{habit.twoMinuteRule?.starterStep}</strong>
              </p>
              {habit.frictionNotes && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Friction design: {habit.frictionNotes}</span>
                </div>
              )}
            </div>

            {/* 4th Law: Make it Satisfying */}
            {habit.immediateReward && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                    4th Law: Satisfying
                  </span>
                  <span>Immediate Reinforcement</span>
                </div>
                <p className="text-slate-300 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{habit.immediateReward}</span>
                </p>
              </div>
            )}

            {/* Card Action Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {onOpenContract && (
                  <button
                    onClick={() => onOpenContract(habit)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Habit Contract</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(habit)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit Habit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 2-Minute Rule Shaping Modal */}
      {showTwoMinuteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg text-white">The 2-Minute Rule & Habit Shaping</h3>
              </div>
              <button
                onClick={() => setShowTwoMinuteModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-4 text-xs text-emerald-300">
              <p className="font-semibold mb-1">
                "When you start a new habit, it should take less than two minutes to do." — James Clear
              </p>
              <p className="text-emerald-300/80">
                You cannot optimize a habit before it exists. Make showing up so easy you cannot say no.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Gateway Starter Action
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-sm font-semibold text-white">
                {habit.twoMinuteRule?.starterStep}
              </div>

              {habit.twoMinuteRule?.scalePhases && habit.twoMinuteRule.scalePhases.length > 0 && (
                <>
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-4">
                    5-Phase Habit Shaping Ladder
                  </div>
                  <div className="space-y-2">
                    {habit.twoMinuteRule.scalePhases.map((phase, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                          idx === 0
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-medium'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400">
                          {idx + 1}
                        </span>
                        <span>{phase}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  handleToggle();
                  setShowTwoMinuteModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-colors"
              >
                Mark Gateway Step as Completed Today
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
