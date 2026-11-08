import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Dna, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Brain, 
  Activity, 
  BookOpen, 
  Briefcase, 
  Edit3, 
  Trash2, 
  X 
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Identity, HabitCategory } from '../types/habits';

interface IdentityViewProps {
  onOpenNewHabitModal: () => void;
}

export const IdentityView: React.FC<IdentityViewProps> = ({ onOpenNewHabitModal }) => {
  const { state, dispatch, identityVotes } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState<Identity | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [targetVotes, setTargetVotes] = useState(100);
  const [color, setColor] = useState('#6366f1');
  const [category, setCategory] = useState<HabitCategory>('productivity');

  const openAdd = () => {
    setEditingIdentity(null);
    setTitle('');
    setStatement('');
    setTargetVotes(100);
    setColor('#6366f1');
    setCategory('productivity');
    setShowModal(true);
  };

  const openEdit = (ident: Identity) => {
    setEditingIdentity(ident);
    setTitle(ident.title);
    setStatement(ident.statement);
    setTargetVotes(ident.targetVotes || 100);
    setColor(ident.color);
    setCategory(ident.category);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingIdentity) {
      dispatch({
        type: 'UPDATE_IDENTITY',
        identity: {
          ...editingIdentity,
          title: title.trim(),
          statement: statement.trim(),
          targetVotes,
          color,
          category
        }
      });
    } else {
      const newIdentity: Identity = {
        id: `ident-${Date.now()}`,
        title: title.trim(),
        statement: statement.trim() || `I am someone who embodies ${title.trim()}`,
        icon: 'Award',
        color,
        targetVotes,
        category,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_IDENTITY', identity: newIdentity });
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete identity "${name}"? Existing habits will need to be linked to another identity.`)) {
      dispatch({ type: 'DELETE_IDENTITY', identityId: id });
    }
  };

  const getTier = (votes: number) => {
    if (votes >= 100) return { name: 'Master Embodiment', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    if (votes >= 50) return { name: 'Unshakable Identity', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    if (votes >= 25) return { name: 'Established Practitioner', color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' };
    if (votes >= 10) return { name: 'Consistent Believer', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' };
    return { name: 'Novice Aspirant', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' };
  };

  return (
    <div className="space-y-6">
      
      {/* Identity Philosophy Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Dna className="w-4 h-4" />
              <span>Identity-Based Habit Architecture</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              "Every action you take is a vote for the type of person you wish to become."
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              True behavior change is identity change. You might start a habit because of motivation, but the only reason you’ll stick with one is that it becomes part of your identity. Each habit completed adds a tangible vote to your tally.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Define New Identity</span>
          </button>
        </div>
      </div>

      {/* Identity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {state.identities.map(identity => {
          const votes = identityVotes[identity.id] || 0;
          const target = identity.targetVotes || 100;
          const progressPct = Math.min(100, Math.round((votes / target) * 100));
          const tier = getTier(votes);
          const linkedHabits = state.habits.filter(h => h.identityId === identity.id && !h.archived);

          return (
            <div
              key={identity.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: identity.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border text-white font-bold text-sm"
                      style={{
                        backgroundColor: `${identity.color}20`,
                        borderColor: `${identity.color}40`,
                        color: identity.color
                      }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{identity.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tier.color}`}>
                        {tier.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(identity)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Edit Identity"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {state.identities.length > 1 && (
                      <button
                        onClick={() => handleDelete(identity.id, identity.title)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Identity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic mb-4 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  "{identity.statement}"
                </p>

                {/* Progress bar and vote count */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Votes Cast:</span>
                    <span className="font-bold text-white">
                      <span style={{ color: identity.color }}>{votes}</span> / {target} votes ({progressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: identity.color
                      }}
                    />
                  </div>
                </div>

                {/* Linked Habit Engines */}
                <div className="border-t border-slate-800/80 pt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Habit Engines Casting Votes:
                  </div>
                  {linkedHabits.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">
                      No active habits linked to this identity yet.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {linkedHabits.map(h => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/50 border border-slate-800 text-slate-300"
                        >
                          <span className="truncate pr-2 font-medium">{h.title}</span>
                          <span className="font-mono text-[10px] text-amber-400 shrink-0">
                            +{h.completedDates.length} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add habit linking directly */}
              <div className="pt-4 mt-2">
                <button
                  onClick={onOpenNewHabitModal}
                  className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Attach New Habit Engine</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Identity */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>{editingIdentity ? 'Refine Identity Statement' : 'Formulate New Identity'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Identity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prolific Writer, Mindful Stoic, Iron Athlete"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Affirmation / Belief Statement *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. I am someone who writes 1,000 words daily before noon."
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Target Votes
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={targetVotes}
                    onChange={e => setTargetVotes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Color Accent
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full h-8 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer p-0.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Save Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
