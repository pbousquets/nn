import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { getRecipeById } from '@/mocks/recipes';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { NutritionInfo } from '@/components/NutritionInfo';
import { Heart, Clock, Users, ChefHat, ArrowLeft, Share2, Edit } from 'lucide-react-native';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = getRecipeById(id);
  const { addToRecentlyViewed, isFavorite, addToFavorites, removeFromFavorites, getUserRecipeById } = useRecipeStore();
  
  // Check if this is a user-created recipe
  const isUserRecipe = !!getUserRecipeById(id);
  
  useEffect(() => {
    if (recipe) {
      addToRecentlyViewed(recipe.id);
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Recipe not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const isFav = isFavorite(recipe.id);

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe.id);
    }
  };
  
  const handleEditRecipe = () => {
    router.push(`/recipe/edit/${recipe.id}`);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <SafeAreaView style={styles.imageOverlay} edges={['top']}>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color={colors.white} />
              </TouchableOpacity>
              
              <View style={styles.rightButtons}>
                {isUserRecipe && (
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={handleEditRecipe}
                  >
                    <Edit size={24} color={colors.white} />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.iconButton}>
                  <Share2 size={24} color={colors.white} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={toggleFavorite}
                >
                  <Heart 
                    size={24} 
                    color={colors.white} 
                    fill={isFav ? colors.primary : 'transparent'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>{recipe.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaValue}>{totalTime} min</Text>
                <Text style={styles.metaLabel}>Total Time</Text>
              </View>
            </View>
            
            <View style={styles.metaItem}>
              <Users size={20} color={colors.primary} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaValue}>{recipe.servings}</Text>
                <Text style={styles.metaLabel}>Servings</Text>
              </View>
            </View>
            
            <View style={styles.metaItem}>
              <ChefHat size={20} color={colors.primary} />
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaValue}>{recipe.difficulty}</Text>
                <Text style={styles.metaLabel}>Difficulty</Text>
              </View>
            </View>
          </View>
          
          <NutritionInfo
            calories={recipe.calories}
            protein={recipe.protein}
            carbs={recipe.carbs}
            fat={recipe.fat}
          />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tagContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
    marginBottom: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTextContainer: {
    marginLeft: 8,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.textLight,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});