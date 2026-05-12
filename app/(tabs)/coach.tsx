import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

import { CoachingCard } from '@/components/coach/CoachingCard';
import { Header } from '@/components/coach/Header';
import { presets, PresetName } from '@/engine/mockMetrics';
import { getCoachingTip, getStatusLine } from '@/engine/rules';
import { getSessions, saveSession } from '@/storage/sessions';

const ACCENT = '#FFB800';

const PRESET_BUTTONS: { label: string; key: PresetName }[] = [
  { label: 'Posture', key: 'postureLow' },
  { label: 'Lighting', key: 'lightingLow' },
  { label: 'Strong', key: 'strongLook' },
];

export default function CoachScreen() {
  const [activePreset, setActivePreset] = useState<PresetName>('postureLow');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const metrics = presets[activePreset];
  const coachingTip = getCoachingTip(metrics);
  const statusLine = getStatusLine(metrics);

  async function handleCapture() {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const previousSessions = await getSessions();
      const prevScore = previousSessions[0]?.presenceScore ?? null;
      const trend = prevScore !== null ? metrics.presenceScore - prevScore : null;

      await saveSession({
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUri: photo.uri,
        presenceScore: metrics.presenceScore,
        postureScore: metrics.postureScore,
        lightingScore: metrics.lightingScore,
        coachingTip,
        statusLine,
        presetName: activePreset,
      });

      router.push({
        pathname: '/results',
        params: {
          imageUri: photo.uri,
          presenceScore: metrics.presenceScore,
          postureScore: metrics.postureScore,
          lightingScore: metrics.lightingScore,
          tip: coachingTip,
          statusLine,
          source: 'capture',
          trend: trend !== null ? String(trend) : '',
        },
      });
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        <Header score={metrics.presenceScore} />
        <Text style={styles.statusLine}>{statusLine}</Text>

        <View style={styles.cameraArea}>
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front">
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </CameraView>
          ) : (
            <CameraPermissionPrompt
              canAskAgain={permission?.canAskAgain ?? true}
              onRequest={requestPermission}
            />
          )}
        </View>

        <View style={styles.metricRow}>
          <MetricPill label="Posture" value={metrics.postureScore} dim={metrics.postureScore < 70} />
          <MetricPill label="Lighting" value={metrics.lightingScore} dim={metrics.lightingScore < 70} />
        </View>

        <CoachingCard tip={coachingTip} />

        <View style={styles.presetRow}>
          {PRESET_BUTTONS.map(({ label, key }) => (
            <TouchableOpacity
              key={key}
              style={[styles.presetButton, activePreset === key && styles.presetButtonActive]}
              onPress={() => setActivePreset(key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetLabel, activePreset === key && styles.presetLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.captureButton, (!permission?.granted || isCapturing) && styles.captureButtonDisabled]}
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={!permission?.granted || isCapturing}
        >
          <Text style={[styles.captureLabel, (!permission?.granted || isCapturing) && styles.captureLabelDisabled]}>
            {isCapturing ? 'Capturing…' : 'Capture'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CameraPermissionPrompt({
  canAskAgain,
  onRequest,
}: {
  canAskAgain: boolean;
  onRequest: () => void;
}) {
  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>Camera Access Needed</Text>
      {canAskAgain ? (
        <>
          <Text style={styles.permissionBody}>
            Ascend uses your camera to give live coaching feedback.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onRequest} activeOpacity={0.7}>
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.permissionBody}>
          Camera access was denied. Enable it in your device Settings.
        </Text>
      )}
    </View>
  );
}

function MetricPill({ label, value, dim }: { label: string; value: number; dim: boolean }) {
  return (
    <View style={[styles.pill, dim && styles.pillDim]}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, dim && styles.pillValueDim]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  screen: { flex: 1, justifyContent: 'space-between' },

  statusLine: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },

  cameraArea: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 28,
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  permissionBody: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionButton: {
    marginTop: 4,
    backgroundColor: '#FFF',
    borderRadius: 100,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  metricRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 18,
    paddingVertical: 16,
  },
  pillDim: {
    backgroundColor: 'rgba(255,59,48,0.07)',
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  pillValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
  },
  pillValueDim: {
    color: '#FF4040',
  },

  presetRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  presetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 100,
    backgroundColor: '#111',
  },
  presetButtonActive: {
    backgroundColor: ACCENT,
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  presetLabelActive: {
    color: '#000',
  },

  captureButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 19,
    borderRadius: 100,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#1A1A1A',
  },
  captureLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.2,
  },
  captureLabelDisabled: {
    color: '#444',
  },
});
