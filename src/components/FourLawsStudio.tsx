import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  Heart, 
  Zap, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Minus, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { HabitScorecardItem, ScorecardImpact, HabitContract } from '../types/habits';
import { getPastDays, formatFriendlyDate, getTodayStr } from '../utils/dateUtils';

export const FourLawsStudio: React.FC = () => {
  const { state, dispatch } = useHabits();
  const [activeLaw, setActiveLaw] = useState<1 | 2 | 3 | 4>(1);

  // Scorecard item form state
  const [newScName, setNewScName] = useState('');
  const [newScTime, setNewScTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newScImpact, setNewScImpact] = useState<ScorecardImpact>('+');

  // Temptation bundling interactive tester
  const [needHabit, setNeedHabit] = useState('Process daily support emails');
  const [wantReward, setWantReward] = useState('Listen to favourite electronic music album');

  // 2-minute rule tester
  const [bigHabitInput, setBigHabitInput] = useState('Read 30 books a year');
  const [starterOutput, setStarterOutput] = useState('Read 1 page every evening before turning off the lamp');

  // Habit Contract form state
  const [contractHabitId, setContractHabitId] = useState(state.habits[0]?.id || '');
  const [pledge, setPledge] = useState('I commit to completing my morning routine 5 days a week.');
  const [stakes, setStakes] = useState('$50 donation to a rival political cause or friend for every missed day.');
  const [accountabilityPartner, setAccountabilityPartner] = useState('David Miller');
  const [partnerContact, setPartnerContact] = useState('david.miller@internal.org');

  const handleAddScorecardItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScName.trim()) return;

    const item: HabitScorecardItem = {
      id: `sc-${Date.now()}`,
      name: newScName.trim(),
      timeOfDay: newScTime,
      impact: newScImpact,
      category: 'productivity'
    };

    dispatch({ type: 'ADD_SCORECARD_ITEM', item });
    setNewScName('');
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractHabitId) return;

    const contract: HabitContract = {
      id: `contract-${Date.now()}`,
      habitId: contractHabitId,
      pledge,
      stakes,
      accountabilityPartner,
      partnerContact,
      signedDate: getTodayStr(),
      status: 'active'
    };

    dispatch({ type: 'SAVE_CONTRACT', contract });
    alert('Habit Contract successfully recorded with accountability partner!');
  };

  const positiveCount = state.scorecard.filter(s => s.impact === '+').length;
  const negativeCount = state.scorecard.filter(s => s.impact === '-').length;
  const neutralCount = state.scorecard.filter(s => s.impact === '=').length;

  const past30Days = getPastDays(30);

  return (
    <div className="space-y-6">
      
      {/* 4 Laws Navigation Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveLaw(1)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeLaw === 1
              ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4" />
            <span>1st Law</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white mb-0.5">Make it Obvious</div>
          <div className="text-[11px] text-slate-400">Scorecard & Habit Stacking</div>
        </button>

        <button
          onClick={() => setActiveLaw(2)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeLaw === 2
              ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4" />
            <span>2nd Law</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white mb-0.5">Make it Attractive</div>
          <div className="text-[11px] text-slate-400">Temptation Bundling</div>
        </button>

        <button
          onClick={() => setActiveLaw(3)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeLaw === 3
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>3rd Law</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white mb-0.5">Make it Easy</div>
          <div className="text-[11px] text-slate-400">The 2-Minute Rule</div>
        </button>

        <button
          onClick={() => setActiveLaw(4)}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeLaw === 4
              ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>4th Law</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white mb-0.5">Make it Satisfying</div>
          <div className="text-[11px] text-slate-400">Habit Contract & Streaks</div>
        </button>
      </div>

      {/* LAW 1: MAKE IT OBVIOUS */}
      {activeLaw === 1 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Habit Stacking Chain Visualizer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Habit Stacking Chain Visualizer</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Formula: "After [Current Habit], I will [New Habit]." One of the best ways to build a new habit is to identify a current habit you already do each day and stack your new behavior on top.
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {state.habits.map(habit => {
                const parent = habit.stackParentHabitId 
                  ? state.habits.find(h => h.id === habit.stackParentHabitId)
                  : null;
                
                return (
                  <div
                    key={habit.id}
                    className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                      <span className="font-semibold text-white">{habit.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300">
                      {parent ? (
                        <>
                          <span className="text-indigo-400 font-mono">STACKED AFTER:</span>
                          <span className="font-semibold text-white px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                            {parent.title}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">
                          Triggered by cue: {habit.implementationIntention?.time} ({habit.implementationIntention?.location})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Scorecard (Pointing and Calling) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <span>The Habit Scorecard: Pointing-and-Calling Audit</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Rate your daily automatic actions as: <strong className="text-emerald-400">+ (Positive)</strong>, <strong className="text-rose-400">- (Negative)</strong>, or <strong className="text-slate-300">= (Neutral)</strong>. You cannot change what you are not conscious of.
                </p>
              </div>

              {/* Tally Metrics */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  +{positiveCount}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                  -{negativeCount}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                  ={neutralCount}
                </span>
              </div>
            </div>

            {/* Add Scorecard Item Form */}
            <form onSubmit={handleAddScorecardItem} className="flex flex-wrap items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Audit a daily action (e.g. Check phone immediately upon waking)"
                value={newScName}
                onChange={e => setNewScName(e.target.value)}
                className="flex-1 min-w-[240px] px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newScTime}
                onChange={e => setNewScTime(e.target.value as any)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              <select
                value={newScImpact}
                onChange={e => setNewScImpact(e.target.value as ScorecardImpact)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none font-bold"
              >
                <option value="+">+ Positive (Reinforces desired identity)</option>
                <option value="-">- Negative (Drains time or health)</option>
                <option value="=">= Neutral (Standard baseline)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
              >
                Audit Action
              </button>
            </form>

            {/* Scorecard Items List */}
            <div className="space-y-2 pt-2">
              {state.scorecard.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {/* Impact toggle buttons */}
                    <div className="flex items-center gap-1 font-mono font-bold">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_SCORECARD_IMPACT', itemId: item.id, impact: '+' })}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          item.impact === '+'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-200'
                        }`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_SCORECARD_IMPACT', itemId: item.id, impact: '=' })}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          item.impact === '='
                            ? 'bg-slate-300 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-200'
                        }`}
                      >
                        =
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_SCORECARD_IMPACT', itemId: item.id, impact: '-' })}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          item.impact === '-'
                            ? 'bg-rose-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-200'
                        }`}
                      >
                        -
                      </button>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.timeOfDay}
                    </span>
                    <button
                      onClick={() => dispatch({ type: 'DELETE_SCORECARD_ITEM', itemId: item.id })}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* LAW 2: MAKE IT ATTRACTIVE */}
      {activeLaw === 2 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Temptation Bundling Engine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>The Temptation Bundling Engine (Premack's Principle)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "Link an action I <span className="text-emerald-400 font-semibold">NEED</span> to do with an action I <span className="text-rose-400 font-semibold">WANT</span> to do. Dopamine spikes in anticipation of the reward, not just upon receiving it."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">
                  Step 1: Habit I NEED to do (Low motivation / High resistance)
                </label>
                <input
                  type="text"
                  value={needHabit}
                  onChange={e => setNeedHabit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-400 mb-1">
                  Step 2: Habit I WANT to do (High dopamine indulgence)
                </label>
                <input
                  type="text"
                  value={wantReward}
                  onChange={e => setWantReward(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Generated Bundle Result */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 text-xs">
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                Engineered Bundle Statement:
              </span>
              <p className="text-sm font-semibold text-white mt-1">
                "I will ONLY <span className="text-rose-300 underline">{wantReward}</span> WHILE or IMMEDIATELY AFTER I <span className="text-emerald-300 underline">{needHabit}</span>."
              </p>
            </div>

            {/* Existing Temptation Bundles across active habits */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Active Temptation Bundles in Your Habits:
              </h4>
              <div className="space-y-2">
                {state.habits.filter(h => h.temptationBundle).map(h => (
                  <div key={h.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs flex items-start gap-2.5">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">{h.title}:</strong>{' '}
                      <span className="text-slate-300">{h.temptationBundle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Reframing Mindset Cards */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">
              Cognitive Reframing: "I Have To" ➔ "I Get To"
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Reframing your habits to highlight their benefits rather than their drawbacks is a quick, lightweight way to reprogram your mind and make a habit seem more attractive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60">
                <div className="text-rose-400 font-semibold mb-1 line-through">"I have to work out early today"</div>
                <div className="text-emerald-300 font-bold">"I get to build physical resilience and endurance today"</div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60">
                <div className="text-rose-400 font-semibold mb-1 line-through">"I have to write complex documentation"</div>
                <div className="text-emerald-300 font-bold">"I get to bring crystal-clear clarity to an entire engineering team"</div>
              </div>

              <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60">
                <div className="text-rose-400 font-semibold mb-1 line-through">"I have to cook dinner at home"</div>
                <div className="text-emerald-300 font-bold">"I get to nourish my body with clean, wholesome energy"</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* LAW 3: MAKE IT EASY */}
      {activeLaw === 3 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* The 2-Minute Rule Laboratory */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>The 2-Minute Rule Laboratory: Standardize Before You Optimize</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "When you dream about making a change, excitement inevitably takes over and you end up trying to do too much too soon. Scale down until it takes less than 2 minutes."
              </p>
            </div>

            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Ultimate Desired Habit
                  </label>
                  <input
                    type="text"
                    value={bigHabitInput}
                    onChange={e => setBigHabitInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-emerald-400 mb-1">
                    The 2-Minute Gateway Step
                  </label>
                  <input
                    type="text"
                    value={starterOutput}
                    onChange={e => setStarterOutput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5-Phase Habit Shaping Table */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                The 5-Phase Habit Shaping Progression (James Clear Paradigm):
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono">1</span>
                  <div>
                    <strong className="text-white">Phase 1: Showing Up (The Gateway Rep)</strong>
                    <p className="text-slate-400">Put on running shoes / Open text editor / Sit on meditation cushion. (2 min)</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold font-mono">2</span>
                  <div>
                    <strong className="text-white">Phase 2: Extremely Light Execution</strong>
                    <p className="text-slate-400">Walk around block / Write 1 sentence / Take 3 deep breaths. (5 min)</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold font-mono">3</span>
                  <div>
                    <strong className="text-white">Phase 3: Moderate Baseline Habit</strong>
                    <p className="text-slate-400">Run for 15 minutes / Write for 25 minutes / Meditate for 10 minutes.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold font-mono">4</span>
                  <div>
                    <strong className="text-white">Phase 4: Standard Full Performance</strong>
                    <p className="text-slate-400">45-minute training run / Complete 90-min deep work block.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold font-mono">5</span>
                  <div>
                    <strong className="text-white">Phase 5: Superior Mastery & Flow</strong>
                    <p className="text-slate-400">Flawless execution with deliberate practice and continuous feedback.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* LAW 4: MAKE IT SATISFYING */}
      {activeLaw === 4 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Visual Habit Matrix (Streak Density) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Visual Habit Matrix: The Power of the Tracker</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "Habit tracking is powerful because it leverages multiple laws: it makes behavior obvious, attractive, and immediately satisfying. Don't break the chain."
              </p>
            </div>

            {/* 30-Day Matrix Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[600px] space-y-2">
                {state.habits.map(habit => (
                  <div key={habit.id} className="flex items-center gap-3 text-xs">
                    <span className="w-36 truncate font-medium text-slate-300 shrink-0">
                      {habit.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {past30Days.map(date => {
                        const done = habit.completedDates.includes(date);
                        return (
                          <div
                            key={date}
                            title={`${date}: ${done ? 'Completed' : 'Missed'}`}
                            className={`w-4 h-4 rounded-sm transition-all ${
                              done
                                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20'
                                : 'bg-slate-800/80 hover:bg-slate-700'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[11px] font-mono text-amber-400 font-bold shrink-0">
                      {habit.streak}d streak
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Habit Contract Creator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>The Habit Contract: Social Stakes & Accountability</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "An accountability partner creates an immediate cost to inaction. We care deeply about what others think of us, and public accountability leverages that pain."
              </p>
            </div>

            <form onSubmit={handleSaveContract} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select Target Habit
                  </label>
                  <select
                    value={contractHabitId}
                    onChange={e => setContractHabitId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  >
                    {state.habits.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Accountability Partner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={accountabilityPartner}
                    onChange={e => setAccountabilityPartner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  The Pledge Statement
                </label>
                <input
                  type="text"
                  required
                  value={pledge}
                  onChange={e => setPledge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-400 mb-1">
                  The Stakes / Financial or Social Forfeit if Missed
                </label>
                <input
                  type="text"
                  required
                  value={stakes}
                  onChange={e => setStakes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-rose-300 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  Ratify Habit Contract
                </button>
              </div>
            </form>

            {/* Active Contracts Display */}
            {state.contracts && state.contracts.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ratified Habit Contracts:
                </h4>
                {state.contracts.map(c => {
                  const linkedHabit = state.habits.find(h => h.id === c.habitId);
                  return (
                    <div
                      key={c.id}
                      className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-sm">
                          {linkedHabit?.title || 'Habit Contract'}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        <strong>Pledge:</strong> {c.pledge}
                      </p>
                      <p className="text-rose-300 font-medium">
                        <strong>Stakes:</strong> {c.stakes}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Partner: {c.accountabilityPartner} ({c.partnerContact})</span>
                        <span>•</span>
                        <span>Signed: {c.signedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
