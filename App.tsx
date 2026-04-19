import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Animated,
  ScrollView
} from 'react-native';
const TypingIndicator = () => {
  const opacities = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  React.useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.stagger(150, [
          Animated.sequence([
            Animated.timing(opacities[0], { toValue: 1, duration: 250, useNativeDriver: false }),
            Animated.timing(opacities[0], { toValue: 0.3, duration: 250, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(opacities[1], { toValue: 1, duration: 250, useNativeDriver: false }),
            Animated.timing(opacities[1], { toValue: 0.3, duration: 250, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(opacities[2], { toValue: 1, duration: 250, useNativeDriver: false }),
            Animated.timing(opacities[2], { toValue: 0.3, duration: 250, useNativeDriver: false }),
          ]),
        ])
      ]).start((event) => {
        if(event.finished) animate();
      });
    };
    animate();
  }, []);

  return (
    <View style={[{ maxWidth: '85%', padding: 14, paddingHorizontal: 20, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E5EA', borderBottomLeftRadius: 4, flexDirection: 'row', alignItems: 'center', width: 70, justifyContent: 'space-between' }]}>
      <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C3E2D', opacity: opacities[0] }} />
      <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C3E2D', opacity: opacities[1] }} />
      <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C3E2D', opacity: opacities[2] }} />
    </View>
  );
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ id: string, text: string, sender: 'user' | 'model' }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);

  // Animated header setup
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_HEIGHT = 220;
  
  // diffClamp allows the value to smoothly slide up and down independent of absolute scroll position
  const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  
  const headerTranslateY = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSend = () => {
    if (inputText.trim()) {
      const newUserMsg = { id: Date.now().toString(), text: inputText, sender: 'user' as const };
      setMessages([...messages, newUserMsg]);
      setInputText('');
      setIsTyping(true);
      
      // Simulate model response
      setTimeout(() => {
        const newModelMsg = { 
          id: (Date.now() + 1).toString(), 
          text: "ROGER THAT! I am processing your request. Sir, yes Sir!", 
          sender: 'model' as const 
        };
        setIsTyping(false);
        setMessages(prev => [...prev, newModelMsg]);
        inputRef.current?.focus();
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sticky Top Banner */}
      <View style={styles.wipBanner}>
        <Text style={styles.wipBannerText}>WIP - We're so tired of winning 🪖</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        
        {/* Animated Floating Header */}
        <Animated.View style={[styles.headerContainer, { 
            transform: [{ translateY: headerTranslateY }], 
            opacity: headerOpacity 
          }]}
          pointerEvents="none"
        >
          <View style={styles.illustration}>
            <Text style={{ fontSize: 90, textAlign: 'center', lineHeight: 110 }}>💂‍♂️</Text>
          </View>
          <Text style={styles.title}>Tactical Command</Text>
          <Text style={styles.subtitle}>Ready for orders, Commander.</Text>
        </Animated.View>

        <Animated.ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
               // handle both standard and Animated refs
               const scrollNode = scrollViewRef.current.scrollToEnd ? scrollViewRef.current : scrollViewRef.current.getNode?.();
               scrollNode?.scrollToEnd({ animated: true });
            }
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: Platform.OS !== 'web' } // useNativeDriver for web can be tricky with diffClamp
          )}
          scrollEventThrottle={16}
        >
          {/* Empty spacer to push content below the absolute header initially */}
          <View style={{ height: HEADER_HEIGHT }} />

          {/* Model Response Area (Chat History) */}
          <View style={styles.chatArea}>
            {messages.length === 0 && !isTyping ? (
              <View style={styles.emptyStateContainer}>
                 <Text style={styles.emptyStateText}>Awaiting your command. Let's deploy.</Text>
              </View>
            ) : (
              <React.Fragment>
                {messages.map(msg => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.messageBubble, 
                      msg.sender === 'user' ? styles.userBubble : styles.modelBubble
                    ]}
                  >
                    <Text style={[
                      styles.messageText, 
                      msg.sender === 'user' ? styles.userText : styles.modelText
                    ]}>
                      {msg.text}
                    </Text>
                  </View>
                ))}
                {isTyping && <TypingIndicator />}
              </React.Fragment>
            )}
          </View>
        </Animated.ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Issue a command..."
            placeholderTextColor="#8e8e93"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="dark" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F5', // Slightly more tactical/olive tint
  },
  wipBanner: {
    backgroundColor: '#FFD700', // Elite Gold Alert
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B8860B',
    zIndex: 999,
  },
  wipBannerText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6F5',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#F5F6F5',
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  illustration: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E2D', // Dark military green
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6E5D',
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  emptyStateContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(44, 62, 45, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 45, 0.1)',
  },
  emptyStateText: {
    color: '#5C6E5D',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#374151', // Tactical Dark grey
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modelText: {
    color: '#2C3E2D',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#1a1a1a',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    backgroundColor: '#2C3E2D', // Military Green
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
