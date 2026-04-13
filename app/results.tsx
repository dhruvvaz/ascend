import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

// All params arrive as strings from the URL — numbers are parsed below
type ResultsParams = {
  imageUri: string;
  presenceScore: string;
  postureScore: string;
  lightingScore: string;
  tip: string;
  statusLine: string;
  source: 'capture' | 'history'; // who opened this screen
  trend: string; // signed number string like "5" or "-3", or "" for first session
};

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();

  const presenceScore = parseInt(params.presenceScore, 10);
  const postureScore = parseInt(params.postureScore, 10);
  const lightingScore = parseInt(params.lightingScore, 10);
  const fromCapture = params.source === 'capture';

  // trend: a number if we have a previous session to compare against, null if first
  const trend = params.trend !== '' ? parseInt(params.trend, 10) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Your Look</Text>
            {/* Show "Saved" only when this is a fresh capture */}
            {fromCapture && (
              <View style={styles.savedBadge}>
                <Text style={styles.savedText}>Saved</Text>
              </View>
            )}
          </View>
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

        {/* Trend line — only shown on fresh captures */}
        {fromCapture && (
          <TrendLine trend={trend} />
        )}

        {/* Coaching tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Coach</Text>
          <Text style={styles.tipText}>{params.tip}</Text>
        </View>

        {/* Buttons — differ based on where we came from */}
        {fromCapture ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryLabel}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryLabel}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Came from history — just go back
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryLabel}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// Shows "+5 vs last session", "-3 vs last session", or "First session"
function TrendLine({ trend }: { trend: number | null }) {
  if (trend === null) {
    return (
      <View style={trendStyles.row}>
        <Text style={trendStyles.neutral}>First session — nothing to compare yet</Text>
      </View>
    );
  }

  const isUp = trend > 0;
  const isDown = trend < 0;
  const sign = isUp ? '+' : '';
  const arrow = isUp ? '↑' : isDown ? '↓' : '→';
  const textStyle = isUp ? trendStyles.up : isDown ? trendStyles.down : trendStyles.neutral;

  return (
    <View style={trendStyles.row}>
      <Text style={textStyle}>
        {arrow}  {sign}{trend} vs last session
      </Text>
    </View>
  );
}

const trendStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  up: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
    letterSpacing: 0.2,
  },
  down: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
    letterSpacing: 0.2,
  },
  neutral: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636366',
    letterSpacing: 0.2,
  },
});

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  savedBadge: {
    backgroundColor: 'rgba(52,199,89,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.3)',
  },
  savedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34C759',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 6,
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
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
});
