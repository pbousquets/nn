import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { useChaosModeStore } from '@/hooks/use-chaos-mode';
import { getRecipeById } from '@/mocks/recipes';
import { Shuffle, Zap } from 'lucide-react-native';

interface ChaosMealPlanProps {
  onSelectRecipe: (recipeId: string) => void;
}

export const ChaosMealPlan = ({ onSelectRecipe }: ChaosMealPlanProps) => {
  const { getRandomRecipe, getRandomFunnyTitle, getRandomColor, getRandomEmoji } = useChaosModeStore();
  const [chaosRecipes, setChaosRecipes] = useState<Array<{ id: string, color: string, emoji: string }>>([]);
  
  // Animation values
  const bounceAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Generate 5 random recipes
    const recipes = Array(5).fill(0).map(() => ({
      id: getRandomRecipe(),
      color: getRandomColor(),
      emoji: getRandomEmoji()
    }));
    
    setChaosRecipes(recipes);
    
    // Start bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ])
    ).start();
    
    return () => {
      bounceAnim.stopAnimation();
    };
  }, []);
  
  const handleShuffle = () => {
    // Generate new random recipes
    const recipes = Array(5).fill(0).map(() => ({
      id: getRandomRecipe(),
      color: getRandomColor(),
      emoji: getRandomEmoji()
    }));
    
    setChaosRecipes(recipes);
  };
  
  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ translateY: bounce }] }}>
          <Zap size={24} color={colors.error} />
        </Animated.View>
        <Text style={styles.title}>{getRandomFunnyTitle()}</Text>
        <TouchableOpacity onPress={handleShuffle} style={styles.shuffleButton}>
          <Shuffle size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.recipesContainer}>
        {chaosRecipes.map((item, index) => {
          const recipe = getRecipeById(item.id);
          if (!recipe) return null;
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.recipeItem, { backgroundColor: item.color }]}
              onPress={() => onSelectRecipe(item.id)}
            >
              <Text style={styles.recipeEmoji}>{item.emoji}</Text>
              <Text style={styles.recipeTitle} numberOfLines={1}>
                {recipe.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 16,
    padding: 16,
    borderStyle: 'dashed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  shuffleButton: {
    backgroundColor: colors.error,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipesContainer: {
    gap: 8,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  recipeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});