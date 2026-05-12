import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { getSessions, Session } from '@/storage/sessions';

const ACCENT = '#FFB800';

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSessions().then(setSessions);
    }, [])
  );

  function openSession(session: Session) {
    router.push({
      pathname: '/results',
      params: {
        imageUri: session.imageUri,
        presenceScore: session.presenceScore,
        postureScore: session.postureScore,
        lightingScore: session.lightingScore,
        tip: session.coachingTip,
        statusLine: session.statusLine,
        source: 'history',
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>
          {sessions.length === 0
            ? 'No sessions yet'
            : `${sessions.length} session${sessions.length === 1 ? '' : 's'}`}
        </Text>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyBody}>
            Capture a frame in the Coach tab to save your first session.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {sessions.map((session) => (
            <SessionItem key={session.id} session={session} onPress={() => openSession(session)} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SessionItem({ session, onPress }: { session: Session; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      <Image source={{ uri: session.imageUri }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.itemBody}>
        <Text style={styles.itemStatusLine} numberOfLines={1}>{session.statusLine}</Text>
        <Text style={styles.itemTimestamp}>{formatTimestamp(session.timestamp)}</Text>
      </View>
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreValue}>{session.presenceScore}</Text>
        <Text style={styles.scoreLabel}>score</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },

  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    marginTop: 4,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 22,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 82,
    height: 82,
    backgroundColor: '#0A0A0A',
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 5,
  },
  itemStatusLine: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#444',
  },

  scoreBadge: {
    alignItems: 'center',
    paddingRight: 18,
    paddingLeft: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
    color: ACCENT,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,184,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
