import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoachingCard } from '@/components/coach/CoachingCard';
import { Header } from '@/components/coach/Header';
import { presets, PresetName } from '@/engine/mockMetrics';
import { getCoachingTip, getStatusLine } from '@/engine/rules';

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

  const metrics = presets[activePreset];
  const coachingTip = getCoachingTip(metrics);
  const statusLine = getStatusLine(metrics);

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
          {/* Live badge */}
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          {/* Centered preset label */}
          <Text style={styles.cameraLabel}>{CAMERA_LABELS[activePreset]}</Text>
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

      </View>
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    color: '#8E8E93',
    letterSpacing: 1.5,
  },
  cameraLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: 1,
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
});
