import { StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  score: number;
};

export function Header({ score }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Ascend</Text>
      <ScoreBadge score={score} />
    </View>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>Presence Score</Text>
      <Text style={styles.badgeScore}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeLabel: {
    fontSize: 10,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeScore: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
});
