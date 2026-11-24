import { StyleSheet, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';

import { colors, fontSizes, motion, radius, spacing } from '@/theme';

import { Message } from './types';

// Fades in and slides up. Reanimated skips the motion if "reduce motion" is on.
export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <Animated.View
      entering={FadeInDown.duration(motion.duration).reduceMotion(ReduceMotion.System)}
      accessible
      accessibilityLabel={`${isUser ? 'You' : 'Assistant'}: ${message.text}`}
      style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
      {isUser ? (
        <Text style={[styles.text, styles.userText]}>{message.text}</Text>
      ) : (
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      )}
    </Animated.View>
  );
}

// Assistant replies can contain **bold**, lists, etc. User text stays plain.
const markdownStyles = StyleSheet.create({
  body: { color: colors.text, fontSize: fontSizes.md },
  paragraph: { marginTop: 0, marginBottom: spacing.xs },
  strong: { fontWeight: '700' },
  bullet_list: { marginBottom: spacing.xs },
  ordered_list: { marginBottom: spacing.xs },
});

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderBottomLeftRadius: radius.sm,
  },
  text: { color: colors.text, fontSize: fontSizes.md },
  userText: { color: colors.background },
});
