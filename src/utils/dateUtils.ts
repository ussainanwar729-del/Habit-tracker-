/**
 * Date and Streak calculation utilities adhering to Atomic Habits principles.
 */

export function getTodayStr(): string {
  const now = new Date();
  return formatDateToISO(now);
}

export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getPastDays(daysCount: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDateToISO(d));
  }
  return dates;
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateToISO(d);
}

/**
 * Calculates the current consecutive streak.
 * If completed today: counts backward consecutively.
 * If not completed today: checks if completed yesterday. If yes, streak is alive and counts backward from yesterday.
 * If neither today nor yesterday was completed: streak is 0.
 */
export function calculateCurrentStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const dateSet = new Set(completedDates);
  const todayStr = getTodayStr();
  const yesterdayStr = getYesterdayStr();
  
  let currentCheck = new Date();
  let streak = 0;
  
  // If completed today, start counting from today
  if (dateSet.has(todayStr)) {
    while (dateSet.has(formatDateToISO(currentCheck))) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
    return streak;
  }
  
  // If completed yesterday, start counting from yesterday
  if (dateSet.has(yesterdayStr)) {
    currentCheck.setDate(currentCheck.getDate() - 1);
    while (dateSet.has(formatDateToISO(currentCheck))) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    }
    return streak;
  }
  
  // Broken streak
  return 0;
}

/**
 * Atomic Habits Principle: "Never Miss Twice"
 * Returns true if the habit was NOT completed yesterday AND is NOT yet completed today.
 * This triggers the critical "Never Miss Twice" intervention banner.
 */
export function isAtRiskOfMissingTwice(completedDates: string[]): boolean {
  if (!completedDates || completedDates.length === 0) return false;
  const dateSet = new Set(completedDates);
  const todayStr = getTodayStr();
  const yesterdayStr = getYesterdayStr();
  
  // If completed today, not at risk
  if (dateSet.has(todayStr)) return false;
  
  // If completed yesterday, not at risk (they just haven't done today yet)
  if (dateSet.has(yesterdayStr)) return false;
  
  // If they have completed this habit at some point, and missed yesterday, they are at risk!
  return true;
}

export function formatFriendlyDate(isoStr: string): string {
  const [y, m, d] = isoStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
