import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.appName}>Ascend</Text>
          <Text style={styles.tagline}>Your daily glow-up check-in</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/coach')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
});
