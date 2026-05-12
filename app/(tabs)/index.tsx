import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { getSessions, computeStreak } from '@/storage/sessions';

const ACCENT = '#FFB800';

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getSessions().then((sessions) => setStreak(computeStreak(sessions)));
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Text style={styles.wordmark}>ascend</Text>

        <View style={styles.hero}>
          <Text style={styles.heading}>How do you{'\n'}show up{'\n'}today?</Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>
                🔥 {streak} day{streak === 1 ? '' : 's'} streak
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/coach')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Start Check-in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 44,
  },
  wordmark: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  heading: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -1.5,
    lineHeight: 62,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.2)',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 100,
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.2,
  },
});
