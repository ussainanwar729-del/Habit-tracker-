import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  MapPin, 
  Layers, 
  Zap, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle 
} from 'lucide-react';
import { Habit, HabitCategory, TimeOfDay } from '../types/habits';
import { useHabits } from '../context/HabitContext';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
}

const CATEGORIES: { id: HabitCategory; label: string }[] = [
  { id: 'productivity', label: 'Productivity' },
  { id: 'health', label: 'Health & Fitness' },
  { id: 'mindset', label: 'Mindset & Stoicism' },
  { id: 'learning', label: 'Learning & Skills' },
  { id: 'creativity', label: 'Craft & Creativity' },
  { id: 'finance', label: 'Finance' }
];

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316'  // Orange
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  habitToEdit
}) => {
  const { state, dispatch } = useHabits();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('productivity');
  const [identityId, setIdentityId] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [color, setColor] = useState(COLORS[0]);

  // 1st Law: Obvious
  const [behavior, setBehavior] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [location, setLocation] = useState('Home Office Desk');
  const [stackParentId, setStackParentId] = useState('');

  // 2nd Law: Attractive
  const [temptationBundle, setTemptationBundle] = useState('');

  // 3rd Law: Easy
  const [starterStep, setStarterStep] = useState('');
  const [frictionNotes, setFrictionNotes] = useState('');

  // 4th Law: Satisfying
  const [immediateReward, setImmediateReward] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setIdentityId(habitToEdit.identityId);
      setTimeOfDay(habitToEdit.timeOfDay);
      setColor(habitToEdit.color || COLORS[0]);

      setBehavior(habitToEdit.implementationIntention?.behavior || '');
      setTime(habitToEdit.implementationIntention?.time || '08:00 AM');
      setLocation(habitToEdit.implementationIntention?.location || '');
      setStackParentId(habitToEdit.stackParentHabitId || '');

      setTemptationBundle(habitToEdit.temptationBundle || '');
      setStarterStep(habitToEdit.twoMinuteRule?.starterStep || '');
      setFrictionNotes(habitToEdit.frictionNotes || '');
      setImmediateReward(habitToEdit.immediateReward || '');
    } else {
      // Defaults
      setTitle('');
      setDescription('');
      setCategory('productivity');
      setIdentityId(state.identities[0]?.id || '');
      setTimeOfDay('morning');
      setColor(COLORS[0]);

      setBehavior('');
      setTime('08:30 AM');
      setLocation('Office Desk');
      setStackParentId('');

      setTemptationBundle('');
      setStarterStep('');
      setFrictionNotes('');
      setImmediateReward('');
      setActiveStep(1);
    }
  }, [habitToEdit, isOpen, state.identities]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const habitData: Habit = {
      id: habitToEdit ? habitToEdit.id : `habit-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      identityId: identityId || (state.identities[0]?.id || ''),
      timeOfDay,
      color,
      icon: 'Zap',
      implementationIntention: {
        behavior: behavior.trim() || title.trim(),
        time: time.trim(),
        location: location.trim()
      },
      stackParentHabitId: stackParentId || undefined,
      temptationBundle: temptationBundle.trim() || undefined,
      twoMinuteRule: {
        starterStep: starterStep.trim() || `Start by doing 2 minutes of ${title}`,
        fullHabit: title.trim()
      },
      frictionNotes: frictionNotes.trim() || undefined,
      immediateReward: immediateReward.trim() || undefined,
      streak: habitToEdit ? habitToEdit.streak : 0,
      bestStreak: habitToEdit ? habitToEdit.bestStreak : 0,
      completedDates: habitToEdit ? habitToEdit.completedDates : [],
      createdAt: habitToEdit ? habitToEdit.createdAt : new Date().toISOString()
    };

    if (habitToEdit) {
      dispatch({ type: 'UPDATE_HABIT', habit: habitData });
    } else {
      dispatch({ type: 'ADD_HABIT', habit: habitData });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{habitToEdit ? 'Refine Atomic Habit' : 'Engineer an Atomic Habit'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Anchored in James Clear's 4 Laws of Behavior Change
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-4 gap-1.5 py-4 border-b border-slate-800/80 text-center text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`py-1.5 px-2 rounded-lg transition-colors ${
              activeStep === 1
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            1. Identity & Cue
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`py-1.5 px-2 rounded-lg transition-colors ${
              activeStep === 2
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            2. Craving
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`py-1.5 px-2 rounded-lg transition-colors ${
              activeStep === 3
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            3. Response
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`py-1.5 px-2 rounded-lg transition-colors ${
              activeStep === 4
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            4. Reward
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 py-4 text-xs sm:text-sm">
          
          {/* STEP 1: IDENTITY & 1ST LAW (OBVIOUS) */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 45-Minute Focused Deep Work"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Identity Supported ("Cast a vote for who you want to be")
                  </label>
                  <select
                    value={identityId}
                    onChange={e => setIdentityId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    {state.identities.map(ident => (
                      <option key={ident.id} value={ident.id}>
                        {ident.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as HabitCategory)}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1st Law: Implementation Intention */}
              <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-3">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">1st Law</span>
                  <span>Make it Obvious: Implementation Intention Formula</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  "People who make a specific plan for when and where they will perform a new habit are far more likely to follow through."
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Time / Cue
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08:30 AM"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Location / Physical Cue
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Office Desk with Noise-Cancelling Headphones"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Habit Stacking (Optional anchor: "After [Current Habit], I will...")
                  </label>
                  <select
                    value={stackParentId}
                    onChange={e => setStackParentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">No parent habit (Stand-alone cue)</option>
                    {state.habits
                      .filter(h => h.id !== habitToEdit?.id)
                      .map(h => (
                        <option key={h.id} value={h.id}>
                          Stack after: {h.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: 2ND LAW (ATTRACTIVE) */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-3">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">2nd Law</span>
                  <span>Make it Attractive: Temptation Bundling Formula</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  "Pair an action you NEED to do with an action you WANT to do. Premack's Principle states that high-probability behaviors will reinforce low-probability behaviors."
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Temptation Bundle
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Only listen to my favorite true crime podcast while I am running on the treadmill."
                    value={temptationBundle}
                    onChange={e => setTemptationBundle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 3RD LAW (EASY / 2-MINUTE RULE) */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">3rd Law</span>
                  <span>Make it Easy: The 2-Minute Gateway Rule</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  "When you start a new habit, it should take less than two minutes to do. Standardize before you optimize."
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    2-Minute Starter Rep *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Put on workout shorts and do 5 squats"
                    value={starterStep}
                    onChange={e => setStarterStep(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Environment Friction Design
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Workout shoes placed right beside bed the night before"
                    value={frictionNotes}
                    onChange={e => setFrictionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 4TH LAW (SATISFYING / REWARD) */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-3">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">4th Law</span>
                  <span>Make it Satisfying: Immediate Sensory Reinforcement</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  "What is immediately rewarded is repeated. What is immediately punished is avoided. Provide a quick, clean dopamine payoff."
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Immediate Reward
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Savor a freshly brewed pour-over coffee while reading news"
                    value={immediateReward}
                    onChange={e => setImmediateReward(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep - 1) as 1 | 2 | 3 | 4)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep + 1) as 1 | 2 | 3 | 4)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  <span>Next Law</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25"
                >
                  {habitToEdit ? 'Save Changes' : 'Anchor Atomic Habit'}
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
