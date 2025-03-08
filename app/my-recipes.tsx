import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { Plus, ChefHat } from 'lucide-react-native';

export default function MyRecipesScreen() {
  const router = useRouter();
  const { getUserRecipes } = useRecipeStore();
  const userRecipes = getUserRecipes();
  
  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };
  
  const navigateToCreateRecipe = () => {
    router.push('/recipe/create');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'My Recipes',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={navigateToCreateRecipe}
        >
          <Plus size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create Recipe</Text>
        </TouchableOpacity>
      </View>
      
      {userRecipes.length > 0 ? (
        <FlatList
          data={userRecipes}
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
          <ChefHat size={64} color={colors.grayLight} />
          <Text style={styles.emptyText}>No recipes yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first recipe by tapping the button above
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recipesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
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