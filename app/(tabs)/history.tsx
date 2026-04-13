import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { getSessions, Session } from '@/storage/sessions';

// Formats a Unix timestamp into something readable like "Apr 13, 2:45 PM"
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

  // Reload the list every time this tab comes into focus
  // so new captures show up without needing a full app restart
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
            Capture a frame in the Live Coach tab to save your first session.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onPress={() => openSession(session)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SessionItem({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      <Image
        source={{ uri: session.imageUri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Text content */}
      <View style={styles.itemBody}>
        <Text style={styles.itemStatusLine} numberOfLines={1}>
          {session.statusLine}
        </Text>
        <Text style={styles.itemTimestamp}>{formatTimestamp(session.timestamp)}</Text>
      </View>

      {/* Presence score badge */}
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreValue}>{session.presenceScore}</Text>
        <Text style={styles.scoreLabel}>Presence</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Page header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636366',
    marginTop: 4,
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Session list
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },

  // Session item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  thumbnail: {
    width: 72,
    height: 72,
    backgroundColor: '#0D0D0D',
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 5,
  },
  itemStatusLine: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#636366',
  },
  scoreBadge: {
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 8,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#636366',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
