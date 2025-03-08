import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RecipeCard } from '@/components/RecipeCard';
import { colors } from '@/constants/colors';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { getRecipeById } from '@/mocks/recipes';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useRecipeStore();
  
  const favoriteRecipes = favorites
    .map(id => getRecipeById(id))
    .filter(recipe => recipe !== undefined);

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>

      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={item => item!.id}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <RecipeCard
                recipe={item!}
                onPress={() => navigateToRecipe(item!.id)}
              />
            </View>
          )}
          contentContainerStyle={styles.recipesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={colors.grayLight} />
          <Text style={styles.emptyText}>No favorite recipes yet</Text>
          <Text style={styles.emptySubtext}>
            Save your favorite recipes for quick access
          </Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  recipesList: {
    paddingHorizontal: 16,
  },
  recipeItem: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});