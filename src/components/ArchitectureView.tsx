import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  Dna, 
  Cpu, 
  Workflow, 
  Check, 
  Copy, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  GitBranch, 
  ShieldCheck 
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeDiagram, setActiveDiagram] = useState<'loop' | 'state' | 'identity' | 'components'>('loop');

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const streakSnippet = `/**
 * Pure Streak Calculation & "Never Miss Twice" Behavioral Interlock
 * Adheres to James Clear: "Missing once is an accident. Missing twice is a new habit."
 */
export function calculateCurrentStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const dateSet = new Set(completedDates);
  const todayStr = getTodayStr();
  const yesterdayStr = getYesterdayStr();
  
  let currentCheck = new Date();
  let streak = 0;
  
  // Rule 1: If done today, count consecutively backwards
  if (dateSet.has(todayStr)) {
    while (dateSet.has(formatDateToISO(currentCheck))) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
    return streak;
  }
  
  // Rule 2: If done yesterday, streak is currently ACTIVE pending today's outcome
  if (dateSet.has(yesterdayStr)) {
    currentCheck.setDate(currentCheck.getDate() - 1);
    while (dateSet.has(formatDateToISO(currentCheck))) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
    return streak;
  }
  
  // Rule 3: Missed both today and yesterday -> streak broken to 0
  return 0;
}

export function isAtRiskOfMissingTwice(completedDates: string[]): boolean {
  if (!completedDates || completedDates.length === 0) return false;
  const dateSet = new Set(completedDates);
  const todayStr = getTodayStr();
  const yesterdayStr = getYesterdayStr();
  
  // If completed today or completed yesterday -> NOT at risk
  if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) return false;
  
  // Otherwise, user missed yesterday and has NOT completed today -> EMERGENCY INTERLOCK
  return true;
}`;

  const stateReducerSnippet = `/**
 * Unidirectional State Management: Atomic Action Reducer
 * Updates immutable habit tree and calculates identity votes & sensory effects
 */
function habitReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_HABIT': {
      const { habitId, date } = action;
      let wasAdded = false;

      const updatedHabits = state.habits.map(h => {
        if (h.id !== habitId) return h;

        const exists = h.completedDates.includes(date);
        const newDates = exists
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];
        wasAdded = !exists;

        const newStreak = calculateCurrentStreak(newDates);
        return {
          ...h,
          completedDates: newDates,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak)
        };
      });

      // 4th Law: Immediate Sensory Reinforcement (Audio Haptic + Confetti)
      if (wasAdded) {
        soundManager.playHabitCheck();
      } else {
        soundManager.playHabitUncheck();
      }

      return { ...state, habits: updatedHabits };
    }
    default:
      return state;
  }
}`;

  const audioEngineSnippet = `/**
 * Web Audio API Synthesis Engine: Zero-Asset Tactile Feedback
 * Generates organic microsecond auditory rewards without network latency.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  public playHabitCheck(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency ramp from 587.33Hz (D5) to 880Hz (A5) for a tactile wooden pop
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }
}`;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
          <Workflow className="w-4 h-4" />
          <span>System Architecture & Engineering Specification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Engineering Behavioral Psychology into Clean Code
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          This system operationalizes James Clear's <em>Atomic Habits</em> through rigorous computer science primitives: immutable state trees, directed acyclic habit stacking, non-blocking Web Audio synthesis, and deterministic streak evaluation.
        </p>
      </div>

      {/* Interactive Diagram Selector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveDiagram('loop')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeDiagram === 'loop'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. The 4 Laws Habit Loop Engine</span>
          </button>

          <button
            onClick={() => setActiveDiagram('state')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeDiagram === 'state'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>2. State Management & Data Pipeline</span>
          </button>

          <button
            onClick={() => setActiveDiagram('identity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeDiagram === 'identity'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>3. Identity-Vote Aggregator</span>
          </button>

          <button
            onClick={() => setActiveDiagram('components')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeDiagram === 'components'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Component Hierarchy Tree</span>
          </button>
        </div>

        {/* DIAGRAM CANVAS CONTAINER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-x-auto">
          
          {/* DIAGRAM 1: HABIT LOOP */}
          {activeDiagram === 'loop' && (
            <div className="min-w-[680px] space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>The Neurological Habit Loop ↔ The 4 Laws of Behavior Change</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Feedback Loop Architecture</span>
              </div>

              {/* 4 Loop Nodes */}
              <div className="grid grid-cols-4 gap-4 text-center">
                
                {/* 1. CUE */}
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 relative">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Step 1: The Problem</span>
                  <div className="text-base font-bold text-white mt-1">CUE</div>
                  <div className="text-[11px] text-indigo-300 font-semibold mt-1">1st Law: Make it Obvious</div>
                  <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    Implementation Intentions<br />
                    Habit Stacking DAG<br />
                    Scorecard Awareness
                  </div>
                </div>

                {/* 2. CRAVING */}
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 relative">
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Step 2: The Motivation</span>
                  <div className="text-base font-bold text-white mt-1">CRAVING</div>
                  <div className="text-[11px] text-rose-300 font-semibold mt-1">2nd Law: Make it Attractive</div>
                  <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    Temptation Bundling<br />
                    Dopamine Anticipation<br />
                    "Get to" Cognitive Reframe
                  </div>
                </div>

                {/* 3. RESPONSE */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 relative">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Step 3: The Action</span>
                  <div className="text-base font-bold text-white mt-1">RESPONSE</div>
                  <div className="text-[11px] text-emerald-300 font-semibold mt-1">3rd Law: Make it Easy</div>
                  <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    The 2-Minute Rule<br />
                    5-Phase Habit Shaping<br />
                    Friction Reduction
                  </div>
                </div>

                {/* 4. REWARD */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 relative">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Step 4: The Payoff</span>
                  <div className="text-base font-bold text-white mt-1">REWARD</div>
                  <div className="text-[11px] text-amber-300 font-semibold mt-1">4th Law: Make it Satisfying</div>
                  <div className="mt-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    Web Audio Chime<br />
                    Never Miss Twice Rule<br />
                    Habit Contract Stakes
                  </div>
                </div>

              </div>

              {/* Loop arrow flow explanation */}
              <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                <span>🔄 <strong>Closed Behavioral Circuit:</strong> Cue triggers Craving ➔ Craving motivates Response ➔ Response provides Reward ➔ Reward satisfies Craving & associates back to Cue.</span>
              </div>
            </div>
          )}

          {/* DIAGRAM 2: STATE FLOW */}
          {activeDiagram === 'state' && (
            <div className="min-w-[700px] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-400" />
                  <span>Unidirectional Data Flow & State Lifecycle Architecture</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">React Context + Pure Reducer</span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs text-center font-mono">
                
                {/* 1. User Interaction */}
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex-1">
                  <div className="text-indigo-400 font-bold mb-1">UI Interaction</div>
                  <div className="text-[11px] text-slate-300">HabitCard checkbox / Modal submit</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

                {/* 2. Dispatch Action */}
                <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/40 flex-1">
                  <div className="text-indigo-300 font-bold mb-1">Dispatch Action</div>
                  <div className="text-[11px] text-slate-300">{`{ type: 'TOGGLE_HABIT' }`}</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

                {/* 3. Pure Reducer */}
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex-1">
                  <div className="text-emerald-400 font-bold mb-1">habitReducer()</div>
                  <div className="text-[11px] text-slate-300">Immutable State Update</div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

                {/* 4. Side Effects & Persistence */}
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40 flex-1">
                  <div className="text-amber-300 font-bold mb-1">Side Effects</div>
                  <div className="text-[11px] text-slate-300">WebAudio + Confetti + LocalStorage</div>
                </div>

              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div>• <strong>Normalized Date Format:</strong> ISO strings ('YYYY-MM-DD') prevent daylight-savings and timezone drift bugs.</div>
                <div>• <strong>Deterministic Streaks:</strong> Recalculated on demand from completed date sets without storing stale counts.</div>
                <div>• <strong>Zero-Asset Audio:</strong> Direct synthesis via Web Audio API removes external network asset dependencies.</div>
              </div>
            </div>
          )}

          {/* DIAGRAM 3: IDENTITY PIPELINE */}
          {activeDiagram === 'identity' && (
            <div className="min-w-[680px] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dna className="w-4 h-4 text-pink-400" />
                  <span>The Identity-Vote Accumulation & Milestone Progression Pipeline</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Outcome ➔ Process ➔ Identity</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Layer 1: Outcome Level</span>
                  <h4 className="text-sm font-bold text-white mt-1">Goal / Result</h4>
                  <p className="text-slate-400 mt-1">"Lose 20 pounds / Run a marathon / Write a book"</p>
                  <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Transient Motivation</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Layer 2: Process Level</span>
                  <h4 className="text-sm font-bold text-white mt-1">Habit Engine</h4>
                  <p className="text-slate-400 mt-1">"Execute 45-min workout at 7:00 AM on the living room mat"</p>
                  <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Repeatable System</span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Layer 3: Identity Core</span>
                  <h4 className="text-sm font-bold text-white mt-1">Belief & Self-Concept</h4>
                  <p className="text-indigo-200 mt-1">"I am a resilient athlete who never misses a movement session."</p>
                  <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Unshakable Identity</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300">
                Formula: <code className="text-amber-400 font-mono">TotalIdentityVotes = ∑ (CompletedDates of all habits attached to IdentityID)</code>
              </div>
            </div>
          )}

          {/* DIAGRAM 4: COMPONENT TREE */}
          {activeDiagram === 'components' && (
            <div className="min-w-[650px] space-y-3 font-mono text-xs animate-in fade-in duration-200">
              <div className="text-slate-400 pb-2 border-b border-slate-800 font-sans text-xs">
                Component Hierarchy & Data Distribution Topology:
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto">
                <div className="text-indigo-400 font-bold">&lt;App /&gt;</div>
                <div className="pl-4 text-emerald-400 font-bold">└── &lt;HabitProvider&gt; (Context & Reducer Store)</div>
                <div className="pl-8 text-slate-300">├── &lt;Header /&gt; (Metrics, Daily %, Sound Switch, Reset)</div>
                <div className="pl-8 text-slate-300">├── &lt;Navigation /&gt; (View tabs, At-Risk alert badges)</div>
                <div className="pl-8 text-indigo-300">├── &lt;DailyHabitList /&gt; (Active view)</div>
                <div className="pl-12 text-slate-400">├── &lt;NeverMissTwiceBanner /&gt;</div>
                <div className="pl-12 text-slate-400">└── &lt;HabitCard /&gt; (4-Laws details, 2-Min Rule Modal)</div>
                <div className="pl-8 text-indigo-300">├── &lt;IdentityView /&gt; (Vote progress, Tier thresholds)</div>
                <div className="pl-8 text-indigo-300">├── &lt;FourLawsStudio /&gt; (Scorecard, Bundling, Contracts)</div>
                <div className="pl-8 text-indigo-300">├── &lt;PlateauCalculator /&gt; (1% Compounding SVG curve)</div>
                <div className="pl-8 text-indigo-300">├── &lt;ArchitectureView /&gt; (This technical manual)</div>
                <div className="pl-8 text-amber-300">└── &lt;HabitModal /&gt; (4-Laws Wizard Form)</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Psychology to Code Translation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Behavioral Psychology ➔ Codebase Implementation Mapping</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Atomic Habits Principle</th>
                <th className="py-2.5 px-3">Psychological Rationale</th>
                <th className="py-2.5 px-3">Technical Architecture Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Identity-Based Habits</td>
                <td className="py-3 px-3 text-slate-400">Every behavior is a vote for who you want to become. Outcomes follow identity.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">Identity.targetVotes, dynamic selector identityVotes[id]</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Implementation Intentions</td>
                <td className="py-3 px-3 text-slate-400">Specifying When & Where removes cognitive ambiguity and hesitation.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">{`{ behavior, time, location }`} structured interface</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Habit Stacking</td>
                <td className="py-3 px-3 text-slate-400">Synaptic pruning: link new behaviors to already established neural pathways.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">stackParentHabitId directed relationship</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Temptation Bundling</td>
                <td className="py-3 px-3 text-slate-400">Premack's Principle: high-probability actions reinforce low-probability ones.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">temptationBundle string and generator schema</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">The 2-Minute Rule</td>
                <td className="py-3 px-3 text-slate-400">Standardize before you optimize. Gateway steps prevent activation friction.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">twoMinuteRule: {`{ starterStep, scalePhases }`}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Never Miss Twice</td>
                <td className="py-3 px-3 text-slate-400">Missing once is an accident. Missing twice starts a competing bad habit.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">isAtRiskOfMissingTwice() urgent banner & selector</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Immediate Reinforcement</td>
                <td className="py-3 px-3 text-slate-400">The brain evolved to prioritize immediate over delayed rewards.</td>
                <td className="py-3 px-3 font-mono text-indigo-400">Web Audio API SoundEngine + canvas-confetti</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Code Snippets with Annotations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Annotated Production Code Snippets</span>
          </div>
          <span className="text-xs text-slate-400">Click copy to inspect or reuse</span>
        </div>

        {/* Snippet 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/80">
            <span className="text-xs font-mono font-semibold text-slate-200">
              1. Pure Streak Calculation & "Never Miss Twice" Guardrail (/src/utils/dateUtils.ts)
            </span>
            <button
              onClick={() => copyCode('streak', streakSnippet)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copiedSnippet === 'streak' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'streak' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {streakSnippet}
          </pre>
        </div>

        {/* Snippet 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/80">
            <span className="text-xs font-mono font-semibold text-slate-200">
              2. Immutable State Reducer & Sensory Dispatch (/src/context/HabitContext.tsx)
            </span>
            <button
              onClick={() => copyCode('reducer', stateReducerSnippet)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copiedSnippet === 'reducer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'reducer' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {stateReducerSnippet}
          </pre>
        </div>

        {/* Snippet 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/80">
            <span className="text-xs font-mono font-semibold text-slate-200">
              3. Web Audio Synthesizer: Zero-Asset Dopamine Payoff (/src/utils/audio.ts)
            </span>
            <button
              onClick={() => copyCode('audio', audioEngineSnippet)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copiedSnippet === 'audio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'audio' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-slate-950/90 leading-relaxed">
            {audioEngineSnippet}
          </pre>
        </div>

      </div>

    </div>
  );
};
