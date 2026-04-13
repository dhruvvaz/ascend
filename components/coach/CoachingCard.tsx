import { StyleSheet, Text, View } from 'react-native';

type CoachingCardProps = {
  tip: string;
};

export function CoachingCard({ tip }: CoachingCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Coach</Text>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tip: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 28,
  },
});
