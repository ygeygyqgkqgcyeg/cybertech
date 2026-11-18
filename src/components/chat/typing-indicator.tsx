import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion, radius, spacing } from '@/theme';

function Dot({ delay }: { delay: number }) {
  const reduceMotion = useReducedMotion();
  const y = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return; // dots stay still
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-motion.bounceDistance, { duration: motion.duration }),
          withTiming(0, { duration: motion.duration }),
        ),
        -1,
      ),
    );
  }, [delay, reduceMotion, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[styles.dot, style]} />;
}

export function TypingIndicator() {
  return (
    <View accessible accessibilityLabel="Assistant is typing" style={styles.bubble}>
      <Dot delay={0} />
      <Dot delay={motion.duration / 3} />
      <Dot delay={(motion.duration / 3) * 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
});
