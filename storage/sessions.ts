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
