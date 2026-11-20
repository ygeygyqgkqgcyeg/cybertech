import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { colors, fontSizes, motion, radius, spacing, touchTarget } from '@/theme';

// Each block fades in a little after the one before it.
function enter(index: number) {
  return FadeInDown.delay(index * 80)
    .duration(motion.duration)
    .reduceMotion(ReduceMotion.System);
}

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Animated.View entering={enter(0)} style={styles.badge} accessible={false}>
          <Text style={styles.badgeEmoji}>💬</Text>
        </Animated.View>

        <Animated.Text entering={enter(1)} accessibilityRole="header" style={styles.title}>
          Hi there, welcome!
        </Animated.Text>

        <Animated.Text entering={enter(2)} style={styles.body}>
          Not sure if something that happened was bullying? Let&apos;s take a quick look at it
          together. There are no wrong answers.
        </Animated.Text>

        <Animated.View entering={enter(3)} style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <Text style={styles.cardText}>• I&apos;ll ask a few simple questions, one at a time.</Text>
          <Text style={styles.cardText}>• You answer in your own words.</Text>
          <Text style={styles.cardText}>• At the end, I&apos;ll suggest a good next step.</Text>
        </Animated.View>

        <Animated.View entering={enter(4)} style={styles.actions}>
          <Button label="Start" onPress={() => router.push('/chat')} />
          {/* The (app) layout sends signed-out users back to sign-in. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={() => signOut()}
            style={styles.link}>
            <Text style={styles.linkText}>Sign out</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
  },
  badgeEmoji: { fontSize: fontSizes.xl },
  title: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '700' },
  body: { color: colors.text, fontSize: fontSizes.md, lineHeight: fontSizes.lg + spacing.xs },
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardTitle: { color: colors.primary, fontSize: fontSizes.lg, fontWeight: '700' },
  cardText: { color: colors.text, fontSize: fontSizes.md },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  link: {
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
});
