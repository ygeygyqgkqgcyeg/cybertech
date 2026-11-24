import { router } from 'expo-router';
import { useCallback, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { ChatResult, useChat } from '@/hooks/use-chat';
import { colors, spacing } from '@/theme';

const ERROR_MESSAGE = {
  id: 'error',
  role: 'assistant' as const,
  text: "I couldn't reply just now. Please try again.",
};

export default function ChatScreen() {
  const listRef = useRef<FlatList>(null);

  const onFinished = useCallback((result: ChatResult) => {
    router.replace({ pathname: '/result', params: result });
  }, []);

  const { messages, typing, failed, send, retry } = useChat(onFinished);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={
            <>
              {typing ? <TypingIndicator /> : null}
              {failed ? (
                <View style={styles.error}>
                  <MessageBubble message={ERROR_MESSAGE} />
                  <Button label="Retry" onPress={retry} />
                </View>
              ) : null}
            </>
          }
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.list}
          style={styles.flex}
        />
        <ChatInput onSend={send} disabled={typing || failed} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: spacing.md, gap: spacing.sm },
  error: { gap: spacing.sm, alignItems: 'flex-start' },
});
