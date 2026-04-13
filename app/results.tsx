import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

// All params arrive as strings from the URL — we parse numbers where needed
type ResultsParams = {
  imageUri: string;
  presenceScore: string;
  postureScore: string;
  lightingScore: string;
  tip: string;
  statusLine: string;
};

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();

  const presenceScore = parseInt(params.presenceScore, 10);
  const postureScore = parseInt(params.postureScore, 10);
  const lightingScore = parseInt(params.lightingScore, 10);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Look</Text>
          <Text style={styles.subtitle}>{params.statusLine}</Text>
        </View>

        {/* Captured image */}
        <Image
          source={{ uri: params.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Score row */}
        <View style={styles.scoreRow}>
          <ScoreCard label="Presence" value={presenceScore} />
          <ScoreCard label="Posture" value={postureScore} dim={postureScore < 70} />
          <ScoreCard label="Lighting" value={lightingScore} dim={lightingScore < 70} />
        </View>

        {/* Coaching tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Coach</Text>
          <Text style={styles.tipText}>{params.tip}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.retakeLabel}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.doneLabel}>Done</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function ScoreCard({ label, value, dim = false }: { label: string; value: number; dim?: boolean }) {
  return (
    <View style={[styles.scoreCard, dim && styles.scoreCardDim]}>
      <Text style={styles.scoreCardLabel}>{label}</Text>
      <Text style={[styles.scoreCardValue, dim && styles.scoreCardValueDim]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    paddingBottom: 32,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 4,
  },

  // Image
  image: {
    marginHorizontal: 16,
    height: 340,
    borderRadius: 24,
    backgroundColor: '#0D0D0D',
  },

  // Score row
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  scoreCardDim: {
    borderColor: 'rgba(255,59,48,0.25)',
  },
  scoreCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#636366',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  scoreCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreCardValueDim: {
    color: '#FF6B6B',
  },

  // Tip card
  tipCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#141414',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#636366',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 28,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  retakeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  retakeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  doneLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
});
