import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { categories } from '@/mocks/categories';
import { getRecipesByCategory } from '@/mocks/recipes';
import { RecipeCard } from '@/components/RecipeCard';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const category = categories.find(cat => cat.id === id);
  const recipes = getRecipesByCategory(id);

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  if (!category) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Category not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: category.name,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <StatusBar style="dark" />
      
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <RecipeCard
                recipe={item}
                onPress={() => navigateToRecipe(item.id)}
              />
            </View>
          )}
          contentContainerStyle={styles.recipesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes in this category</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  recipesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recipeItem: {
    marginBottom: 16,
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
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
  },
});