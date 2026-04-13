import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { getSessions, computeStreak } from '@/storage/sessions';

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);

  // Reload streak every time this tab is focused
  useFocusEffect(
    useCallback(() => {
      getSessions().then((sessions) => setStreak(computeStreak(sessions)));
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.appName}>Ascend</Text>
          <Text style={styles.tagline}>Your daily glow-up check-in</Text>

          {/* Streak badge — hidden until the user has at least 1 session */}
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakFlame}>🔥</Text>
              <Text style={styles.streakText}>
                {streak} day{streak === 1 ? '' : 's'} streak
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/coach')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#8E8E93',
    letterSpacing: 0.5,
  },

  // Streak
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255,149,0,0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.25)',
  },
  streakFlame: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
    letterSpacing: 0.3,
  },

  // CTA
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
});
