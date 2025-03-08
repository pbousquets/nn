import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { recipes } from '@/mocks/recipes';
import { CategoryCard } from '@/components/CategoryCard';
import { RecipeCard } from '@/components/RecipeCard';
import { colors } from '@/constants/colors';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { useMealPlanStore } from '@/hooks/use-meal-plan-store';
import { getRecipeById } from '@/mocks/recipes';
import { Plus, ChevronRight, ShoppingBag, BookOpen } from 'lucide-react-native';
import { RecipeRecommendation } from '@/components/RecipeRecommendation';
import { SecretTapArea } from '@/components/SecretTapArea';
import { useChaosModeStore } from '@/hooks/use-chaos-mode';
import { ChaosMealPlan } from '@/components/ChaosMealPlan';
import { ChaosButton } from '@/components/ChaosButton';
import { categories } from '@/mocks/categories';

export default function HomeScreen() {
  const router = useRouter();
  const { recentlyViewed, getUserRecipes } = useRecipeStore();
  const { getRecommendedRecipes, getLastUsedDate } = useMealPlanStore();
  const { isEnabled: chaosMode } = useChaosModeStore();
  
  // Get random recipes instead of featured
  const getRandomRecipes = (count: number) => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const randomRecipes = getRandomRecipes(3);
  const userRecipes = getUserRecipes();
  const recommendedRecipes = getRecommendedRecipes(5);
  
  const recentlyViewedRecipes = recentlyViewed
    .map(id => getRecipeById(id))
    .filter(recipe => recipe !== undefined);

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  const navigateToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };
  
  const navigateToCreateRecipe = () => {
    router.push('/recipe/create');
  };
  
  const navigateToAllCategories = () => {
    router.push('/categories');
  };
  
  const navigateToMealPlan = () => {
    router.push('/meal-plan');
  };
  
  const navigateToShoppingList = () => {
    router.push('/shopping-list');
  };
  
  const navigateToMyRecipes = () => {
    router.push('/my-recipes');
  };
  
  // Calculate days since last use for a recipe
  const getDaysSinceLastUse = (recipeId: string) => {
    const lastUsedDate = getLastUsedDate(recipeId);
    if (!lastUsedDate) return null;
    
    const lastDate = new Date(lastUsedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SecretTapArea>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.greeting}>Hello, Chef!</Text>
              {chaosMode && <ChaosButton size={32} />}
            </View>
            <Text style={styles.subtitle}>What would you like to cook today?</Text>
          </View>
        </SecretTapArea>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToCreateRecipe}
          >
            <View style={styles.quickActionIcon}>
              <Plus size={24} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>New Recipe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToShoppingList}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
              <ShoppingBag size={24} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>Shopping List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToMyRecipes}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.tertiary }]}>
              <BookOpen size={24} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>My Recipes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealPlanBanner}>
          <View style={styles.mealPlanContent}>
            <Text style={styles.mealPlanTitle}>Weekly Meal Plan</Text>
            <Text style={styles.mealPlanSubtitle}>Plan your meals for the week</Text>
          </View>
          <TouchableOpacity 
            style={styles.mealPlanButton}
            onPress={navigateToMealPlan}
          >
            <Text style={styles.mealPlanButtonText}>View Plan</Text>
          </TouchableOpacity>
        </View>

        {chaosMode && (
          <ChaosMealPlan onSelectRecipe={navigateToRecipe} />
        )}

        {recommendedRecipes.length > 0 && (
          <View style={styles.section}>
            <RecipeRecommendation
              title="Recommended For You"
              recipeIds={recommendedRecipes}
              onSelectRecipe={navigateToRecipe}
              emptyMessage="Use recipes in your meal plan to get recommendations"
            />
          </View>
        )}

        {userRecipes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Recipes</Text>
              <TouchableOpacity onPress={() => router.push('/my-recipes')}>
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See All</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={userRecipes.slice(0, 3)}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => navigateToRecipe(item.id)}
                  horizontal
                  daysSinceLastUse={getDaysSinceLastUse(item.id)}
                />
              )}
              ListFooterComponent={
                userRecipes.length < 5 ? (
                  <TouchableOpacity 
                    style={styles.createRecipeCard}
                    onPress={navigateToCreateRecipe}
                  >
                    <View style={styles.createRecipeContent}>
                      <Plus size={32} color={colors.primary} />
                      <Text style={styles.createRecipeText}>Create New Recipe</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        )}

        {recentlyViewedRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <FlatList
              data={recentlyViewedRecipes}
              keyExtractor={item => item!.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item!}
                  onPress={() => navigateToRecipe(item!.id)}
                  horizontal
                  daysSinceLastUse={getDaysSinceLastUse(item!.id)}
                />
              )}
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={navigateToAllCategories}>
              <View style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {/* Only show first 4 categories */}
            {[0, 1, 2, 3].map((index) => (
              <View key={index} style={styles.horizontalCategoryItem}>
                <CategoryCard
                  category={recipes.filter(r => r.category === categories[index].name)[0] ? categories[index] : categories[0]}
                  onPress={() => navigateToCategory(categories[index].id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Random Recipes</Text>
          {randomRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => navigateToRecipe(recipe.id)}
              daysSinceLastUse={getDaysSinceLastUse(recipe.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionButton: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  mealPlanBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPlanContent: {
    flex: 1,
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  mealPlanSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  mealPlanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mealPlanButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  horizontalCategoryItem: {
    width: 150,
    height: 150,
    marginRight: 12,
  },
  horizontalListContent: {
    paddingRight: 16,
  },
  createRecipeCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  createRecipeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  createRecipeText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});