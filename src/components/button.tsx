import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, radius, spacing, touchTarget } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
};

export function Button({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.button}>
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
  label: { color: colors.background, fontSize: fontSizes.md, fontWeight: '600' },
});
