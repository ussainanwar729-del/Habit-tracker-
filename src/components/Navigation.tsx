import React from 'react';
import { 
  CheckSquare, 
  Dna, 
  Layers, 
  TrendingUp, 
  Code2, 
  AlertTriangle 
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';

export type ActiveTab = 'daily' | 'identity' | 'fourLaws' | 'plateau' | 'architecture';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { habitsAtRisk, todayCompletedCount, todayTotalCount } = useHabits();

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: React.ReactNode }[] = [
    {
      id: 'daily',
      label: 'Daily Execution',
      icon: CheckSquare,
      badge: habitsAtRisk.length > 0 ? (
        <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <AlertTriangle className="w-2.5 h-2.5" />
          {habitsAtRisk.length}
        </span>
      ) : (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
          {todayCompletedCount}/{todayTotalCount}
        </span>
      )
    },
    {
      id: 'identity',
      label: 'Identity Core',
      icon: Dna
    },
    {
      id: 'fourLaws',
      label: '4 Laws Studio',
      icon: Layers
    },
    {
      id: 'plateau',
      label: '1% Compounding',
      icon: TrendingUp
    },
    {
      id: 'architecture',
      label: 'Architecture & Engineering',
      icon: Code2
    }
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
