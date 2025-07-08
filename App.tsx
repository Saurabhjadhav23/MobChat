import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChatProvider } from './src/context/ChatContext';
import ChatScreen from './src/screens/ChatScreen';
import SplashScreen from './src/screens/Startup';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ChatProvider>
        <SafeAreaView style={styles.safeArea}>
          {isSplashVisible ? <SplashScreen /> : <ChatScreen />}
        </SafeAreaView>
      </ChatProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});
