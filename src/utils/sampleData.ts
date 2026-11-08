import { Habit, Identity, HabitScorecardItem, HabitContract } from '../types/habits';
import { getPastDays, getTodayStr, getYesterdayStr } from './dateUtils';

export const SAMPLE_IDENTITIES: Identity[] = [
  {
    id: 'ident-1',
    title: 'Disciplined Deep Craftsman',
    statement: 'I am someone who produces high-value, deep cognitive work daily without distraction.',
    icon: 'Brain',
    color: '#6366f1', // Indigo
    targetVotes: 100,
    category: 'productivity',
    createdAt: '2026-10-01'
  },
  {
    id: 'ident-2',
    title: 'Resilient Athlete',
    statement: 'I am someone who honors physical strength, mobility, and never misses a daily movement session.',
    icon: 'Activity',
    color: '#10b981', // Emerald
    targetVotes: 100,
    category: 'health',
    createdAt: '2026-10-01'
  },
  {
    id: 'ident-3',
    title: 'Mindful Stoic & Reader',
    statement: 'I am someone who cultivates emotional calm, reads wisdom daily, and reflects before responding.',
    icon: 'BookOpen',
    color: '#f59e0b', // Amber
    targetVotes: 75,
    category: 'mindset',
    createdAt: '2026-10-01'
  },
  {
    id: 'ident-4',
    title: 'Compound Learner',
    statement: 'I am someone who improves my craft by 1% every single day through deliberate practice.',
    icon: 'Sparkles',
    color: '#ec4899', // Pink
    targetVotes: 50,
    category: 'learning',
    createdAt: '2026-10-01'
  }
];

// Generate past 28 days of history with high realistic adherence
const past28 = getPastDays(28);
const today = getTodayStr();
const yesterday = getYesterdayStr();

// Deep work: completed past 14 days consistently including yesterday
const deepWorkHistory = past28.slice(10); // 18 days streak

// Workout: completed regularly, including today
const workoutHistory = [...past28.slice(8), today];

// Reading: missed yesterday (triggers the "Never Miss Twice" warning!)
const readingHistory = past28.filter(d => d !== yesterday && d !== today).slice(12);

// Environment reset: high streak
const environmentHistory = [...past28.slice(14), yesterday];

export const SAMPLE_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: '90-Minute Uninterrupted Deep Work',
    description: 'Tackle the single most cognitively demanding task with notifications silenced.',
    category: 'productivity',
    identityId: 'ident-1',
    timeOfDay: 'morning',
    color: '#6366f1',
    icon: 'Zap',
    implementationIntention: {
      behavior: 'close all messaging apps and write core architecture modules',
      time: '08:30 AM',
      location: 'Home Office Desk with Noise-Cancelling Headphones'
    },
    stackParentHabitId: '',
    temptationBundle: 'Only play the cyberpunk lo-fi soundscape while in Deep Work mode.',
    twoMinuteRule: {
      starterStep: 'Open the code editor, close slack, and write the first comment or test signature.',
      fullHabit: '90 minutes of zero-distraction programming and architectural design.',
      scalePhases: [
        'Phase 1: Sit at desk and turn off phone (2 min)',
        'Phase 2: Open project repository and outline 3 tasks',
        'Phase 3: Work for 25 minutes without opening browser tabs',
        'Phase 4: Complete 60 minutes of uninterrupted work',
        'Phase 5: Master full 90-minute flow block'
      ]
    },
    frictionNotes: 'Keep terminal open; phone placed inside drawer in another room.',
    immediateReward: 'Check off session box and enjoy a freshly brewed pour-over coffee.',
    streak: 18,
    bestStreak: 24,
    completedDates: deepWorkHistory,
    createdAt: '2026-10-05'
  },
  {
    id: 'habit-2',
    title: 'Movement & Strength Training',
    description: 'Full-body kettlebell or calisthenics routine to forge functional strength.',
    category: 'health',
    identityId: 'ident-2',
    timeOfDay: 'morning',
    color: '#10b981',
    icon: 'Activity',
    implementationIntention: {
      behavior: 'execute the strength progression circuit',
      time: '07:00 AM',
      location: 'Living Room Workout Mat'
    },
    stackParentHabitId: '',
    temptationBundle: 'Listen to my favorite behavioral science podcast only while on the workout mat.',
    twoMinuteRule: {
      starterStep: 'Put on athletic shorts, fill water bottle, and do 5 bodyweight squats.',
      fullHabit: '45-minute structured compound movement session.',
      scalePhases: [
        'Phase 1: Put on workout clothes and sneakers (2 min)',
        'Phase 2: Do 5 minutes of mobility stretching',
        'Phase 3: Complete 2 circuits (15 min)',
        'Phase 4: Complete standard 30 min session',
        'Phase 5: High-intensity 45 min workout with progression tracking'
      ]
    },
    frictionNotes: 'Gym shoes and kettlebells laid out beside bed the night before.',
    immediateReward: 'Invigorating cold splash shower and electrolyte recovery drink.',
    streak: 21,
    bestStreak: 21,
    completedDates: workoutHistory,
    createdAt: '2026-10-02'
  },
  {
    id: 'habit-3',
    title: '20 Pages of Deep Non-Fiction Reading',
    description: 'High-density reading in philosophy, psychology, or systems design.',
    category: 'mindset',
    identityId: 'ident-3',
    timeOfDay: 'evening',
    color: '#f59e0b',
    icon: 'BookOpen',
    implementationIntention: {
      behavior: 'read 20 pages with a highlighter in hand',
      time: '09:15 PM',
      location: 'Reading Armchair with warm reading lamp'
    },
    stackParentHabitId: 'habit-4', // Stacked after evening wind-down!
    temptationBundle: 'Sip hot peppermint tea in my favorite ceramic mug while reading.',
    twoMinuteRule: {
      starterStep: 'Open the book to current bookmark and read exactly 1 sentence.',
      fullHabit: 'Read 20 pages with margin notes and insight extraction.',
      scalePhases: [
        'Phase 1: Place book in hands and read 1 page (2 min)',
        'Phase 2: Read for 5 minutes',
        'Phase 3: Read 10 pages and highlight key ideas',
        'Phase 4: Read 20 pages',
        'Phase 5: Read 30+ pages and write a 1-sentence synthesis in journal'
      ]
    },
    frictionNotes: 'Book physically sitting on pillow during the day so it must be touched before sleeping.',
    immediateReward: 'Underline 1 profound sentence that challenges my worldview.',
    streak: 0, // Missed yesterday! Demonstrates "Never Miss Twice" rule
    bestStreak: 16,
    completedDates: readingHistory,
    createdAt: '2026-10-06'
  },
  {
    id: 'habit-4',
    title: 'Environment Reset & Friction Audit',
    description: 'Clear desk surfaces, stage clothes for tomorrow, eliminate friction cues.',
    category: 'productivity',
    identityId: 'ident-1',
    timeOfDay: 'evening',
    color: '#8b5cf6',
    icon: 'Sparkles',
    implementationIntention: {
      behavior: 'reset desk to zero clutter and prepare tomorrow morning cues',
      time: '09:00 PM',
      location: 'Workstation & Bedroom'
    },
    temptationBundle: 'Play smooth acoustic playlist while wiping down surfaces.',
    twoMinuteRule: {
      starterStep: 'Throw away 1 piece of trash and close laptop lid.',
      fullHabit: 'Complete 10-minute workstation reset and tomorrow-cue staging.',
      scalePhases: [
        'Phase 1: Put one item back in place (2 min)',
        'Phase 2: Wipe desk surface and close laptop',
        'Phase 3: Stage notebook and pen with tomorrow top priority',
        'Phase 4: Stage clothes for morning workout',
        'Phase 5: Full 360-degree environment optimization'
      ]
    },
    frictionNotes: 'Have microfiber cloth and coaster ready on shelf.',
    immediateReward: 'Breathe a sigh of relief looking at an impeccably clean, calm space.',
    streak: 15,
    bestStreak: 19,
    completedDates: environmentHistory,
    createdAt: '2026-10-10'
  }
];

export const SAMPLE_SCORECARD: HabitScorecardItem[] = [
  { id: 'sc-1', name: 'Wake up to alarm and get out of bed immediately', timeOfDay: 'morning', impact: '+', category: 'productivity', notes: 'Avoids grogginess and sleep inertia' },
  { id: 'sc-2', name: 'Check phone notifications & social feeds while in bed', timeOfDay: 'morning', impact: '-', category: 'productivity', notes: 'High dopamine hijack before cognitive clarity' },
  { id: 'sc-3', name: 'Drink 500ml room-temperature water', timeOfDay: 'morning', impact: '+', category: 'health', notes: 'Hydrates metabolic systems after sleep' },
  { id: 'sc-4', name: 'Change straight into workout clothes', timeOfDay: 'morning', impact: '+', category: 'health', notes: 'Reduces friction for physical training' },
  { id: 'sc-5', name: 'Leave browser tabs open with YouTube & news', timeOfDay: 'afternoon', impact: '-', category: 'productivity', notes: 'Triggers context switching during work blocks' },
  { id: 'sc-6', name: 'Take a 10-minute post-lunch brisk walk', timeOfDay: 'afternoon', impact: '+', category: 'health', notes: 'Blunts blood glucose spike and resets focus' },
  { id: 'sc-7', name: 'Put phone in charging dock outside bedroom at 9:00 PM', timeOfDay: 'evening', impact: '+', category: 'mindset', notes: 'Crucial environment design rule' },
  { id: 'sc-8', name: 'Eat high-sugar snack while watching television', timeOfDay: 'evening', impact: '-', category: 'health', notes: 'Unconscious mindless consumption' },
  { id: 'sc-9', name: 'Brush and floss teeth', timeOfDay: 'evening', impact: '=', category: 'health', notes: 'Automatic baseline hygiene' }
];

export const SAMPLE_CONTRACT: HabitContract = {
  id: 'contract-1',
  habitId: 'habit-1',
  pledge: 'I commit to conducting 90 minutes of Deep Work on every weekday morning by 08:30 AM.',
  stakes: '$50 transferred directly to my accountability partner for every missed weekday session, plus sending them a public screenshot of my apology.',
  accountabilityPartner: 'Marcus Vance (Senior Engineering Lead)',
  partnerContact: 'marcus.vance@techcollab.internal',
  signedDate: '2026-10-15',
  status: 'active'
};
