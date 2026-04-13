import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

import { CoachingCard } from '@/components/coach/CoachingCard';
import { Header } from '@/components/coach/Header';
import { presets, PresetName } from '@/engine/mockMetrics';
import { getCoachingTip, getStatusLine } from '@/engine/rules';
import { saveSession } from '@/storage/sessions';

const PRESET_BUTTONS: { label: string; key: PresetName }[] = [
  { label: 'Posture', key: 'postureLow' },
  { label: 'Lighting', key: 'lightingLow' },
  { label: 'Strong', key: 'strongLook' },
];

const CAMERA_LABELS: Record<PresetName, string> = {
  postureLow: 'Posture Check',
  lightingLow: 'Lighting Check',
  strongLook: 'Strong Look',
};

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

      // Persist the session locally before navigating
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
        },
      });
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>

        {/* Header + status line */}
        <View>
          <Header score={metrics.presenceScore} />
          <Text style={styles.statusLine}>{statusLine}</Text>
        </View>

        {/* Camera area */}
        <View style={styles.cameraArea}>
          {permission?.granted ? (
            // Camera is allowed — show the live feed with overlays on top
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front">
              {/* Live badge */}
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>

              {/* Centered preset label */}
              <View style={styles.cameraLabelContainer}>
                <Text style={styles.cameraLabel}>{CAMERA_LABELS[activePreset]}</Text>
              </View>
            </CameraView>
          ) : (
            // Permission not granted yet — show a prompt inside the camera area
            <CameraPermissionPrompt
              canAskAgain={permission?.canAskAgain ?? true}
              onRequest={requestPermission}
            />
          )}
        </View>

        {/* Metric row */}
        <View style={styles.metricRow}>
          <MetricPill label="Posture" value={metrics.postureScore} dim={metrics.postureScore < 70} />
          <MetricPill label="Lighting" value={metrics.lightingScore} dim={metrics.lightingScore < 70} />
        </View>

        {/* Coaching card */}
        <CoachingCard tip={coachingTip} />

        {/* Preset switcher */}
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

        {/* Capture button */}
        <TouchableOpacity
          style={[styles.captureButton, (!permission?.granted || isCapturing) && styles.captureButtonDisabled]}
          onPress={handleCapture}
          activeOpacity={0.8}
          disabled={!permission?.granted || isCapturing}
        >
          <Text style={styles.captureLabel}>
            {isCapturing ? 'Capturing…' : 'Capture Frame'}
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Shown inside the camera area when the user has not granted permission
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
          Camera access was denied. Enable it in your device Settings to use Live Coach.
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
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Status line
  statusLine: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.3,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  // Camera area
  cameraArea: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',  // clips the CameraView to the rounded corners
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  cameraLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.30)',
    letterSpacing: 1,
  },

  // Permission prompt
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permissionBody: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionButton: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },

  // Metric row
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  pillDim: {
    borderColor: 'rgba(255,59,48,0.25)',
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#636366',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  pillValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillValueDim: {
    color: '#FF6B6B',
  },

  // Preset row
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 4,
  },
  presetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  presetButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    letterSpacing: 0.2,
  },
  presetLabelActive: {
    color: '#000000',
  },

  // Capture button
  captureButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  captureLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.2,
  },
});
