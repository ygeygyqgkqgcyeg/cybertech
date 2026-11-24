import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { ScreenLayout } from '@/components/screen-layout';
import { colors, fontSizes, spacing } from '@/theme';

export default function ResultScreen() {
  const { summary, nextStep } = useLocalSearchParams<{ summary?: string; nextStep?: string }>();

  return (
    <ScreenLayout title="Your result" body={summary ?? 'Thank you for sharing with me.'}>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          A good next step
        </Text>
        <Text style={styles.text}>
          {nextStep ?? 'Talk to a trusted adult, like a parent, a teacher, or a school counselor.'}
        </Text>
      </View>
      <Text style={styles.note}>
        This is only a guide to help you think. It is not a diagnosis or a legal decision.
      </Text>
      <Button label="Start over" onPress={() => router.replace('/home')} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  heading: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '700' },
  text: { color: colors.text, fontSize: fontSizes.md },
  note: { color: colors.text, fontSize: fontSizes.sm },
});
