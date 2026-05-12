import { StyleSheet, Text, View } from 'react-native';

const ACCENT = '#FFB800';

type HeaderProps = { score: number };

export function Header({ score }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>ascend</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeScore}>{score}</Text>
        <Text style={styles.badgeLabel}>presence</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  wordmark: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.2)',
  },
  badgeScore: {
    fontSize: 28,
    fontWeight: '800',
    color: ACCENT,
    lineHeight: 32,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,184,0,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
