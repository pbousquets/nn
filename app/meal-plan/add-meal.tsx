import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { recipes as allRecipes, getRecipeById } from '@/mocks/recipes';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { useMealPlanStore } from '@/hooks/use-meal-plan-store';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { RecipeListItem } from '@/components/RecipeListItem';
import { SearchBar } from '@/components/SearchBar';
import { ArrowLeft, Image as ImageIcon, ImageOff } from 'lucide-react-native';

export default function AddMealScreen() {
  const { day, mealType } = useLocalSearchParams<{ day: string; mealType: string }>();
  const router = useRouter();
  
  const { getUserRecipes } = useRecipeStore();
  const { addMeal, getLastUsedDate } = useMealPlanStore();
  const { showRecipeImages, toggleShowRecipeImages } = useSettingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<typeof allRecipes>([]);
  const [showUserRecipesOnly, setShowUserRecipesOnly] = useState(false);
  
  const userRecipes = getUserRecipes();
  const allAvailableRecipes = [...allRecipes, ...userRecipes];
  
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
  
  // Sort recipes by last used date (oldest first)
  const sortRecipesByLastUsed = (recipes: typeof allRecipes) => {
    return [...recipes].sort((a, b) => {
      const aDays = getDaysSinceLastUse(a.id) || 1000; // If never used, put at the end
      const bDays = getDaysSinceLastUse(b.id) || 1000;
      return bDays - aDays; // Oldest first
    });
  };
  
  useEffect(() => {
    let recipes = showUserRecipesOnly ? userRecipes : allAvailableRecipes;
    
    if (searchQuery) {
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort by last used date
    recipes = sortRecipesByLastUsed(recipes);
    
    setFilteredRecipes(recipes);
  }, [searchQuery, showUserRecipesOnly, userRecipes, allAvailableRecipes]);
  
  const handleSelectRecipe = (recipeId: string) => {
    const recipe = getRecipeById(recipeId) || userRecipes.find(r => r.id === recipeId);
    
    if (!recipe) {
      Alert.alert('Error', 'Recipe not found');
      return;
    }
    
    addMeal(day, mealType, recipeId);
    
    Alert.alert(
      'Success',
      `Added ${recipe.title} to ${mealType} on ${day}`,
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: `Add ${mealType} for ${day}`,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleShowRecipeImages} 
              style={styles.headerButton}
            >
              {showRecipeImages ? (
                <ImageIcon size={24} color={colors.primary} />
              ) : (
                <ImageOff size={24} color={colors.textLight} />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search recipes..."
          onClear={() => setSearchQuery('')}
        />
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Show my recipes only</Text>
          <Switch
            value={showUserRecipesOnly}
            onValueChange={setShowUserRecipesOnly}
            trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
            thumbColor={showUserRecipesOnly ? colors.primary : colors.gray}
          />
        </View>
        
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RecipeListItem
                recipe={item}
                onPress={() => handleSelectRecipe(item.id)}
                showImage={showRecipeImages}
                daysSinceLastUse={getDaysSinceLastUse(item.id)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.text,
  },
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});