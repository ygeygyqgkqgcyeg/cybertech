import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fontSizes, radius, spacing, touchTarget } from '@/theme';

type Props = { onSend: (text: string) => void; disabled?: boolean };

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.bar}>
      <TextInput
        accessibilityLabel="Type your message"
        placeholder="Type here..."
        placeholderTextColor={colors.text}
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="send"
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        onPress={send}
        style={styles.send}>
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    color: colors.text,
    fontSize: fontSizes.md,
  },
  send: {
    minHeight: touchTarget,
    minWidth: touchTarget,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  sendText: { color: colors.background, fontSize: fontSizes.md, fontWeight: '600' },
});
