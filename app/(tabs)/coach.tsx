import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoachingCard } from '@/components/coach/CoachingCard';
import { Header } from '@/components/coach/Header';

const PRESENCE_SCORE = 72;
const COACHING_TIP = 'Straighten your posture and keep your chin parallel to the floor.';

export default function CoachScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        {/* Top header */}
        <Header score={PRESENCE_SCORE} />

        {/* Camera placeholder */}
        <View style={styles.cameraPlaceholder} />

        {/* Bottom coaching card */}
        <CoachingCard tip={COACHING_TIP} />
      </View>
    </SafeAreaView>
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
});
