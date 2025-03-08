import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Recipe } from '@/types/recipe';
import { colors } from '@/constants/colors';
import { Clock, Users, Heart } from 'lucide-react-native';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { useSettingsStore } from '@/hooks/use-settings-store';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  horizontal?: boolean;
  daysSinceLastUse?: number | null;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width with 16px padding on each side
const horizontalCardWidth = 280;

export const RecipeCard = ({ 
  recipe, 
  onPress, 
  horizontal = false,
  daysSinceLastUse
}: RecipeCardProps) => {
  const { isFavorite } = useRecipeStore();
  const { showRecipeImages } = useSettingsStore();
  const favorite = isFavorite(recipe.id);
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        horizontal ? styles.horizontalContainer : null
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showRecipeImages && (
        <Image
          source={{ uri: recipe.imageUrl }}
          style={horizontal ? styles.horizontalImage : styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
            <Text style={styles.category}>{recipe.category}</Text>
          </View>
          
          {favorite && (
            <View style={styles.favoriteIcon}>
              <Heart size={16} color={colors.error} fill={colors.error} />
            </View>
          )}
        </View>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.metaText}>{totalTime} min</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Users size={14} color={colors.textLight} />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
          
          {daysSinceLastUse !== null && daysSinceLastUse !== undefined && (
            <View style={[
              styles.lastUsedBadge,
              daysSinceLastUse > 14 ? styles.lastUsedBadgeOld : null
            ]}>
              <Text style={styles.lastUsedText}>
                {daysSinceLastUse === 0 ? 'Today' : 
                 daysSinceLastUse === 1 ? 'Yesterday' : 
                 `${daysSinceLastUse}d ago`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalContainer: {
    width: horizontalCardWidth,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  horizontalImage: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    flexShrink: 1,
  },
  category: {
    fontSize: 14,
    color: colors.textLight,
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  lastUsedBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lastUsedBadgeOld: {
    backgroundColor: colors.warningLight,
  },
  lastUsedText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});