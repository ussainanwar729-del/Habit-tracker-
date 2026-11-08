import React, { createContext, useContext, useReducer, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Habit, 
  Identity, 
  HabitScorecardItem, 
  HabitContract, 
  HabitCategory,
  ScorecardImpact 
} from '../types/habits';
import { 
  SAMPLE_HABITS, 
  SAMPLE_IDENTITIES, 
  SAMPLE_SCORECARD, 
  SAMPLE_CONTRACT 
} from '../utils/sampleData';
import { 
  getTodayStr, 
  calculateCurrentStreak, 
  isAtRiskOfMissingTwice 
} from '../utils/dateUtils';
import { soundManager } from '../utils/audio';

interface State {
  habits: Habit[];
  identities: Identity[];
  scorecard: HabitScorecardItem[];
  contracts: HabitContract[];
  soundEnabled: boolean;
  selectedDate: string;
  categoryFilter: HabitCategory | 'all';
  searchQuery: string;
}

type Action =
  | { type: 'TOGGLE_HABIT'; habitId: string; date: string }
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'UPDATE_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; habitId: string }
  | { type: 'ADD_IDENTITY'; identity: Identity }
  | { type: 'UPDATE_IDENTITY'; identity: Identity }
  | { type: 'DELETE_IDENTITY'; identityId: string }
  | { type: 'ADD_SCORECARD_ITEM'; item: HabitScorecardItem }
  | { type: 'UPDATE_SCORECARD_IMPACT'; itemId: string; impact: ScorecardImpact }
  | { type: 'DELETE_SCORECARD_ITEM'; itemId: string }
  | { type: 'SAVE_CONTRACT'; contract: HabitContract }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_CATEGORY_FILTER'; category: HabitCategory | 'all' }
  | { type: 'SET_SELECTED_DATE'; date: string }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'RESET_TO_DEFAULTS' };

const STORAGE_KEY = 'atomic_habits_state_v1';

function loadInitialState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        habits: parsed.habits || SAMPLE_HABITS,
        identities: parsed.identities || SAMPLE_IDENTITIES,
        scorecard: parsed.scorecard || SAMPLE_SCORECARD,
        contracts: parsed.contracts || [SAMPLE_CONTRACT],
        soundEnabled: parsed.soundEnabled ?? true,
        selectedDate: getTodayStr(),
        categoryFilter: 'all',
        searchQuery: ''
      };
    }
  } catch (err) {
    console.warn('Failed to parse localStorage state:', err);
  }

  return {
    habits: SAMPLE_HABITS,
    identities: SAMPLE_IDENTITIES,
    scorecard: SAMPLE_SCORECARD,
    contracts: [SAMPLE_CONTRACT],
    soundEnabled: true,
    selectedDate: getTodayStr(),
    categoryFilter: 'all',
    searchQuery: ''
  };
}

function habitReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_HABIT': {
      const { habitId, date } = action;
      let wasAdded = false;

      const updatedHabits = state.habits.map(h => {
        if (h.id !== habitId) return h;

        const exists = h.completedDates.includes(date);
        let newDates: string[];

        if (exists) {
          newDates = h.completedDates.filter(d => d !== date);
          wasAdded = false;
        } else {
          newDates = [...h.completedDates, date];
          wasAdded = true;
        }

        const newStreak = calculateCurrentStreak(newDates);
        const newBestStreak = Math.max(h.bestStreak, newStreak);

        return {
          ...h,
          completedDates: newDates,
          streak: newStreak,
          bestStreak: newBestStreak
        };
      });

      // Sensory feedback (4th Law: Make it Satisfying)
      if (wasAdded) {
        soundManager.playHabitCheck();
        
        // Check if all active habits for today are now completed
        const todayStr = getTodayStr();
        if (date === todayStr) {
          const totalActive = updatedHabits.filter(h => !h.archived);
          const allDone = totalActive.every(h => h.completedDates.includes(todayStr));
          if (allDone && totalActive.length > 0) {
            setTimeout(() => {
              soundManager.playCelebration();
              try {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.7 },
                  colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
                });
              } catch {
                // Ignore confetti fallback
              }
            }, 120);
          }
        }
      } else {
        soundManager.playHabitUncheck();
      }

      return {
        ...state,
        habits: updatedHabits
      };
    }

    case 'ADD_HABIT': {
      const streak = calculateCurrentStreak(action.habit.completedDates || []);
      const newHabit = {
        ...action.habit,
        streak,
        bestStreak: Math.max(action.habit.bestStreak || 0, streak)
      };
      return {
        ...state,
        habits: [newHabit, ...state.habits]
      };
    }

    case 'UPDATE_HABIT': {
      const streak = calculateCurrentStreak(action.habit.completedDates || []);
      const updated = {
        ...action.habit,
        streak,
        bestStreak: Math.max(action.habit.bestStreak || 0, streak)
      };
      return {
        ...state,
        habits: state.habits.map(h => (h.id === updated.id ? updated : h))
      };
    }

    case 'DELETE_HABIT': {
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.habitId),
        contracts: state.contracts.filter(c => c.habitId !== action.habitId)
      };
    }

    case 'ADD_IDENTITY': {
      return {
        ...state,
        identities: [...state.identities, action.identity]
      };
    }

    case 'UPDATE_IDENTITY': {
      return {
        ...state,
        identities: state.identities.map(i => (i.id === action.identity.id ? action.identity : i))
      };
    }

    case 'DELETE_IDENTITY': {
      return {
        ...state,
        identities: state.identities.filter(i => i.id !== action.identityId)
      };
    }

    case 'ADD_SCORECARD_ITEM': {
      return {
        ...state,
        scorecard: [...state.scorecard, action.item]
      };
    }

    case 'UPDATE_SCORECARD_IMPACT': {
      return {
        ...state,
        scorecard: state.scorecard.map(item =>
          item.id === action.itemId ? { ...item, impact: action.impact } : item
        )
      };
    }

    case 'DELETE_SCORECARD_ITEM': {
      return {
        ...state,
        scorecard: state.scorecard.filter(item => item.id !== action.itemId)
      };
    }

    case 'SAVE_CONTRACT': {
      const existing = state.contracts.find(c => c.habitId === action.contract.habitId);
      const contracts = existing
        ? state.contracts.map(c => (c.habitId === action.contract.habitId ? action.contract : c))
        : [...state.contracts, action.contract];
      return {
        ...state,
        contracts
      };
    }

    case 'TOGGLE_SOUND': {
      const next = !state.soundEnabled;
      soundManager.setEnabled(next);
      return {
        ...state,
        soundEnabled: next
      };
    }

    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.category };

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.date };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query };

    case 'RESET_TO_DEFAULTS': {
      return {
        habits: SAMPLE_HABITS,
        identities: SAMPLE_IDENTITIES,
        scorecard: SAMPLE_SCORECARD,
        contracts: [SAMPLE_CONTRACT],
        soundEnabled: true,
        selectedDate: getTodayStr(),
        categoryFilter: 'all',
        searchQuery: ''
      };
    }

    default:
      return state;
  }
}

interface HabitContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  
  // Computed Selectors
  identityVotes: Record<string, number>;
  habitsAtRisk: Habit[];
  todayCompletedCount: number;
  todayTotalCount: number;
  totalVotesCast: number;
  longestStreakEver: number;
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, null, loadInitialState);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          habits: state.habits,
          identities: state.identities,
          scorecard: state.scorecard,
          contracts: state.contracts,
          soundEnabled: state.soundEnabled
        })
      );
    } catch (err) {
      console.warn('Failed to persist habits state:', err);
    }
  }, [state.habits, state.identities, state.scorecard, state.contracts, state.soundEnabled]);

  // Sync sound manager state
  useEffect(() => {
    soundManager.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // Compute Identity Votes: Each completed habit date counts as a vote for its associated identity
  const identityVotes: Record<string, number> = {};
  state.identities.forEach(ident => {
    identityVotes[ident.id] = 0;
  });

  let totalVotesCast = 0;
  let longestStreakEver = 0;

  state.habits.forEach(habit => {
    const votesForThisHabit = habit.completedDates.length;
    totalVotesCast += votesForThisHabit;
    if (habit.bestStreak > longestStreakEver) {
      longestStreakEver = habit.bestStreak;
    }
    if (habit.identityId && identityVotes[habit.identityId] !== undefined) {
      identityVotes[habit.identityId] += votesForThisHabit;
    }
  });

  // Calculate Habits at risk of "Missing Twice"
  const habitsAtRisk = state.habits.filter(h => !h.archived && isAtRiskOfMissingTwice(h.completedDates));

  const todayStr = getTodayStr();
  const activeHabits = state.habits.filter(h => !h.archived);
  const todayTotalCount = activeHabits.length;
  const todayCompletedCount = activeHabits.filter(h => h.completedDates.includes(todayStr)).length;

  const value: HabitContextValue = {
    state,
    dispatch,
    identityVotes,
    habitsAtRisk,
    todayCompletedCount,
    todayTotalCount,
    totalVotesCast,
    longestStreakEver
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return ctx;
}
