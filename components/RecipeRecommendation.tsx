import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { getRecipeById } from '@/mocks/recipes';
import { useMealPlanStore } from '@/hooks/use-meal-plan-store';
import { Clock, ChefHat } from 'lucide-react-native';

interface RecipeRecommendationProps {
  title: string;
  recipeIds: string[];
  onSelectRecipe: (recipeId: string) => void;
  emptyMessage?: string;
}

export const RecipeRecommendation = ({ 
  title, 
  recipeIds, 
  onSelectRecipe,
  emptyMessage = 'No recipes to show'
}: RecipeRecommendationProps) => {
  const { getRecipeUsageCount } = useMealPlanStore();
  
  const recipes = recipeIds
    .map(id => getRecipeById(id))
    .filter(recipe => recipe !== undefined);
  
  if (recipes.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <FlatList
        data={recipes}
        keyExtractor={item => item!.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          if (!item) return null;
          
          const usageCount = getRecipeUsageCount(item.id);
          const totalTime = item.prepTime + item.cookTime;
          
          return (
            <TouchableOpacity 
              style={styles.recipeCard}
              onPress={() => onSelectRecipe(item.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.recipeImage}
                contentFit="cover"
              />
              
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                
                <View style={styles.recipeMetaContainer}>
                  <View style={styles.recipeMeta}>
                    <Clock size={12} color={colors.textLight} />
                    <Text style={styles.recipeMetaText}>{totalTime} min</Text>
                  </View>
                  
                  <View style={styles.recipeMeta}>
                    <ChefHat size={12} color={colors.textLight} />
                    <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
                  </View>
                </View>
                
                {usageCount > 0 && (
                  <View style={styles.usageContainer}>
                    <Text style={styles.usageText}>
                      Used {usageCount} {usageCount === 1 ? 'time' : 'times'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  recipeCard: {
    width: 200,
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginRight: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeMetaText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  usageContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  usageText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
});