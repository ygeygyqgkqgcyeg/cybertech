import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSizes, spacing } from '@/theme';

type Props = {
  title: string;
  body: string;
  children?: ReactNode;
};

// Shared placeholder layout: a title, a sentence, and room for buttons.
export function ScreenLayout({ title, body, children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.body}>{body}</Text>
        {children}
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
  title: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '700' },
  body: { color: colors.text, fontSize: fontSizes.md },
});
