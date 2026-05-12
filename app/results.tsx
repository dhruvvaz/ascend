import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const ACCENT = '#FFB800';

type ResultsParams = {
  imageUri: string;
  presenceScore: string;
  postureScore: string;
  lightingScore: string;
  tip: string;
  statusLine: string;
  source: 'capture' | 'history';
  trend: string;
};

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();
  const presenceScore = parseInt(params.presenceScore, 10);
  const postureScore = parseInt(params.postureScore, 10);
  const lightingScore = parseInt(params.lightingScore, 10);
  const fromCapture = params.source === 'capture';
  const trend = params.trend !== '' ? parseInt(params.trend, 10) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>Your Look</Text>
              <Text style={styles.statusLine} numberOfLines={2}>{params.statusLine}</Text>
            </View>
            {fromCapture && (
              <View style={styles.savedBadge}>
                <Text style={styles.savedText}>Saved ✓</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.heroScore}>
          <Text style={styles.heroScoreValue}>{presenceScore}</Text>
          <Text style={styles.heroScoreLabel}>presence score</Text>
        </View>

        <Image
          source={{ uri: params.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {fromCapture && <TrendLine trend={trend} />}

        <View style={styles.scoreRow}>
          <ScoreCard label="Posture" value={postureScore} dim={postureScore < 70} />
          <ScoreCard label="Lighting" value={lightingScore} dim={lightingScore < 70} />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>coach</Text>
          <Text style={styles.tipText}>{params.tip}</Text>
        </View>

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
              activeOpacity={0.85}
            >
              <Text style={styles.primaryLabel}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryLabel}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

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
      <Text style={textStyle}>{arrow}  {sign}{trend} vs last session</Text>
    </View>
  );
}

const trendStyles = StyleSheet.create({
  row: { paddingHorizontal: 20, paddingTop: 14 },
  up: { fontSize: 14, fontWeight: '600', color: '#4CAF50', letterSpacing: 0.2 },
  down: { fontSize: 14, fontWeight: '600', color: '#FF4040', letterSpacing: 0.2 },
  neutral: { fontSize: 14, fontWeight: '500', color: '#555', letterSpacing: 0.2 },
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
  safeArea: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingBottom: 44 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  statusLine: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  savedBadge: {
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
    marginTop: 2,
  },
  savedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },

  heroScore: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  heroScoreValue: {
    fontSize: 88,
    fontWeight: '800',
    color: ACCENT,
    lineHeight: 92,
    letterSpacing: -4,
  },
  heroScoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,184,0,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },

  image: {
    marginHorizontal: 16,
    height: 380,
    borderRadius: 28,
    backgroundColor: '#111',
  },

  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: 18,
  },
  scoreCardDim: {
    backgroundColor: 'rgba(255,64,64,0.07)',
  },
  scoreCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  scoreCardValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
  },
  scoreCardValueDim: {
    color: '#FF4040',
  },

  tipCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#111',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 28,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 100,
    backgroundColor: '#111',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  primaryButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 100,
    backgroundColor: '#FFF',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
});
