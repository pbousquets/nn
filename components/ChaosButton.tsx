import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated, Easing, View } from 'react-native';
import { useChaosModeStore } from '@/hooks/use-chaos-mode';
import { colors } from '@/constants/colors';
import { Sparkles } from 'lucide-react-native';

interface ChaosButtonProps {
  size?: number;
}

export const ChaosButton = ({ size = 40 }: ChaosButtonProps) => {
  const { isEnabled, toggleChaosMode, getRandomEmoji, getRandomColor } = useChaosModeStore();
  const [emoji, setEmoji] = useState('🍳');
  const [buttonColor, setButtonColor] = useState(colors.primary);
  
  // Animation values
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  
  useEffect(() => {
    if (isEnabled) {
      // Start continuous rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
      
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
      
      // Change emoji and color periodically
      const interval = setInterval(() => {
        setEmoji(getRandomEmoji());
        setButtonColor(getRandomColor());
      }, 2000);
      
      return () => {
        clearInterval(interval);
        rotateAnim.stopAnimation();
        scaleAnim.stopAnimation();
      };
    } else {
      // Reset animations
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      setEmoji('🍳');
      setButtonColor(colors.primary);
    }
  }, [isEnabled]);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const handlePress = () => {
    toggleChaosMode();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { rotate: spin },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { 
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isEnabled ? buttonColor : colors.primary
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {isEnabled ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <Sparkles size={size * 0.5} color={colors.white} />
        )}
      </TouchableOpacity>
      
      {isEnabled && (
        <View style={styles.chaosLabel}>
          <Text style={styles.chaosText}>CHAOS MODE</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emoji: {
    fontSize: 20,
  },
  chaosLabel: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  chaosText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  }
});