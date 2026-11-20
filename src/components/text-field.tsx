import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors, fontSizes, radius, spacing, touchTarget } from '@/theme';

// A labelled text box. `label` is read aloud by screen readers.
export function TextField({ label, ...rest }: TextInputProps & { label: string }) {
  return (
    <TextInput
      accessibilityLabel={label}
      placeholder={label}
      placeholderTextColor={colors.text}
      style={styles.input}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
  },
});
