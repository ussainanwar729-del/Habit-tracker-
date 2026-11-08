import React, { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DailyHabitList } from './components/DailyHabitList';
import { IdentityView } from './components/IdentityView';
import { FourLawsStudio } from './components/FourLawsStudio';
import { PlateauCalculator } from './components/PlateauCalculator';
import { ArchitectureView } from './components/ArchitectureView';
import { HabitModal } from './components/HabitModal';
import { Habit } from './types/habits';

function HabitApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('daily');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const handleOpenNewHabitModal = () => {
    setHabitToEdit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsHabitModalOpen(true);
  };

  const handleOpenContract = (_habit: Habit) => {
    setActiveTab('fourLaws');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header />

      {/* Module Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'daily' && (
          <DailyHabitList
            onOpenNewHabitModal={handleOpenNewHabitModal}
            onEditHabit={handleEditHabit}
            onOpenContract={handleOpenContract}
          />
        )}

        {activeTab === 'identity' && (
          <IdentityView
            onOpenNewHabitModal={handleOpenNewHabitModal}
          />
        )}

        {activeTab === 'fourLaws' && (
          <FourLawsStudio />
        )}

        {activeTab === 'plateau' && (
          <PlateauCalculator />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Habit Creation & Editing Wizard Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        habitToEdit={habitToEdit}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="italic text-slate-400 mb-1">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
          <p className="text-[11px] text-slate-600">
            Based on the behavioral psychology framework of James Clear's <em>Atomic Habits</em>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <HabitApp />
    </HabitProvider>
  );
}
