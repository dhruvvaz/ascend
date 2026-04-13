import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoachingCard } from '@/components/coach/CoachingCard';
import { Header } from '@/components/coach/Header';
import { presets, PresetName } from '@/engine/mockMetrics';
import { getCoachingTip } from '@/engine/rules';

const PRESET_BUTTONS: { label: string; key: PresetName }[] = [
  { label: 'Posture', key: 'postureLow' },
  { label: 'Lighting', key: 'lightingLow' },
  { label: 'Strong', key: 'strongLook' },
];

export default function CoachScreen() {
  const [activePreset, setActivePreset] = useState<PresetName>('postureLow');

  const metrics = presets[activePreset];
  const coachingTip = getCoachingTip(metrics);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        {/* Top header */}
        <Header score={metrics.presenceScore} />

        {/* Camera placeholder */}
        <View style={styles.cameraPlaceholder} />

        {/* Metric row */}
        <View style={styles.metricRow}>
          <MetricPill label="Posture" value={metrics.postureScore} />
          <MetricPill label="Lighting" value={metrics.lightingScore} />
        </View>

        {/* Bottom coaching card */}
        <CoachingCard tip={coachingTip} />

        {/* Preset switcher */}
        <View style={styles.presetRow}>
          {PRESET_BUTTONS.map(({ label, key }) => (
            <TouchableOpacity
              key={key}
              style={[styles.presetButton, activePreset === key && styles.presetButtonActive]}
              onPress={() => setActivePreset(key)}
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

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
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
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#111111',
    marginHorizontal: 16,
    borderRadius: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  pillValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  presetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  presetButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  presetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  presetLabelActive: {
    color: '#000000',
  },
});
