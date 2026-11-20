import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, radius, spacing, touchTarget } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Button({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget,
    minWidth: touchTarget,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  disabled: { opacity: 0.5 },
  label: { color: colors.background, fontSize: fontSizes.md, fontWeight: '600' },
});
