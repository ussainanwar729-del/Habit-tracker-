export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type HabitCategory = 'productivity' | 'health' | 'mindset' | 'learning' | 'creativity' | 'finance';

export interface ImplementationIntention {
  behavior: string;  // What I will do
  time: string;      // At what time
  location: string;  // Where I will do it
}

export interface TwoMinuteRule {
  starterStep: string;   // Gateway habit taking < 2 minutes (e.g., "Put on running shoes")
  fullHabit: string;     // The target habit (e.g., "Run 5 miles")
  scalePhases?: string[]; // 5 phases of habit shaping
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  identityId: string; // "Every action is a vote for the type of person you wish to become"
  timeOfDay: TimeOfDay;
  color: string;
  icon: string;
  
  // 1st Law: Make it Obvious
  implementationIntention: ImplementationIntention;
  stackParentHabitId?: string; // "After [Current Habit], I will [New Habit]"
  
  // 2nd Law: Make it Attractive
  temptationBundle?: string; // "Only do [Want] while doing [Need]"
  
  // 3rd Law: Make it Easy
  twoMinuteRule: TwoMinuteRule;
  frictionNotes?: string;
  
  // 4th Law: Make it Satisfying
  immediateReward?: string;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ISO 'YYYY-MM-DD'
  
  // Meta
  createdAt: string;
  archived?: boolean;
}

export interface Identity {
  id: string;
  title: string;          // e.g. "Disciplined Deep Worker"
  statement: string;      // e.g. "I am someone who produces exceptional cognitive work daily"
  icon: string;
  color: string;
  targetVotes: number;    // Goal votes (e.g. 100 votes)
  category: HabitCategory;
  createdAt: string;
}

export type ScorecardImpact = '+' | '-' | '='; // Positive, Negative, Neutral

export interface HabitScorecardItem {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  impact: ScorecardImpact;
  category: HabitCategory;
  notes?: string;
}

export interface HabitContract {
  id: string;
  habitId: string;
  pledge: string;
  stakes: string;                 // The painful cost/forfeit of failing
  accountabilityPartner: string;  // Who checks in
  partnerContact: string;
  signedDate: string;
  status: 'active' | 'fulfilled' | 'breached';
}

export interface HabitStats {
  totalVotesCast: number;
  activeHabitsCount: number;
  completionRate7d: number;
  completionRate30d: number;
  currentStreaksSum: number;
  atRiskHabitsCount: number; // Habits that missed yesterday and need to avoid "missing twice"
}
