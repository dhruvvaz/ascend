import { StyleSheet, Text, View } from 'react-native';

type CoachingCardProps = { tip: string };

export function CoachingCard({ tip }: CoachingCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>coach</Text>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  tip: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 26,
  },
});
