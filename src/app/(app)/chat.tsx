import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { useFakeChat } from '@/hooks/use-fake-chat';
import { colors, spacing } from '@/theme';

export default function ChatScreen() {
  const { messages, typing, send } = useFakeChat();
  const listRef = useRef<FlatList>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        {/* Temporary: goes to the result until the real flow is built. */}
        <Button label="See result" onPress={() => router.push('/result')} />
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={typing ? <TypingIndicator /> : undefined}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.list}
          style={styles.flex}
        />
        <ChatInput onSend={send} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  list: { padding: spacing.md, gap: spacing.sm },
});
