import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Recipe } from '@/types/recipe';
import { colors } from '@/constants/colors';
import { Clock, Users, Heart } from 'lucide-react-native';
import { useRecipeStore } from '@/hooks/use-recipe-store';

interface RecipeListItemProps {
  recipe: Recipe;
  onPress: () => void;
  showImage?: boolean;
  daysSinceLastUse?: number | null;
}

export const RecipeListItem = ({ 
  recipe, 
  onPress,
  showImage = true,
  daysSinceLastUse
}: RecipeListItemProps) => {
  const { isFavorite } = useRecipeStore();
  const favorite = isFavorite(recipe.id);
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showImage && (
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
          {favorite && (
            <Heart size={16} color={colors.error} fill={colors.error} />
          )}
        </View>
        
        <Text style={styles.category}>{recipe.category}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.metaText}>{totalTime} min</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Users size={14} color={colors.textLight} />
            <Text style={styles.metaText}>{recipe.servings}</Text>
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  category: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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