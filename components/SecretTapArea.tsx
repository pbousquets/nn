import React, { useRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';
import { useChaosModeStore } from '@/hooks/use-chaos-mode';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface SecretTapAreaProps {
  children: React.ReactNode;
}

// Number of taps needed to activate chaos mode
const REQUIRED_TAPS = 7;

export const SecretTapArea = ({ children }: SecretTapAreaProps) => {
  const { secretTapCount, incrementSecretTapCount, toggleChaosMode, isEnabled } = useChaosModeStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const handleTap = () => {
    if (isEnabled) return;
    
    incrementSecretTapCount();
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Pulse animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    // Check if we've reached the required number of taps
    if (secretTapCount + 1 >= REQUIRED_TAPS) {
      toggleChaosMode();
      
      // Stronger haptic feedback when activated
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});