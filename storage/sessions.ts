import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ascend_sessions';

// The shape of one saved session
export type Session = {
  id: string;
  timestamp: number;       // Unix ms — Date.now()
  imageUri: string;
  presenceScore: number;
  postureScore: number;
  lightingScore: number;
  coachingTip: string;
  statusLine: string;
  presetName: string;
};

// Prepend a new session to the stored list
export async function saveSession(session: Session): Promise<void> {
  const existing = await getSessions();
  const updated = [session, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Return all sessions, most recent first. Returns [] if nothing stored yet.
export async function getSessions(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Session[];
}

// Wipe all stored sessions
export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

// Returns "YYYY-MM-DD" in the device's local timezone.
// Using local date methods avoids off-by-one errors near midnight in non-UTC zones.
function toDayKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Returns the day key for the calendar day before the given one.
function prevDayKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d); // local midnight
  date.setDate(date.getDate() - 1);
  return toDayKey(date.getTime());
}

// Counts how many consecutive calendar days (ending today or yesterday) have
// at least one session. Returns 0 if the streak has already been broken.
export function computeStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  // Collect unique day keys, sorted newest-first
  const uniqueDays = [...new Set(sessions.map((s) => toDayKey(s.timestamp)))];
  uniqueDays.sort((a, b) => (a > b ? -1 : 1));

  const todayKey = toDayKey(Date.now());
  const yesterdayKey = prevDayKey(todayKey);

  // A streak must include either today or yesterday — otherwise it's broken
  if (uniqueDays[0] !== todayKey && uniqueDays[0] !== yesterdayKey) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i] === prevDayKey(uniqueDays[i - 1])) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
