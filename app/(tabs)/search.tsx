import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { colors } from '@/constants/colors';
import { searchRecipes } from '@/mocks/recipes';
import { Recipe } from '@/types/recipe';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const foundRecipes = searchRecipes(searchQuery);
      setResults(foundRecipes);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const navigateToRecipe = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
      </View>

      {isSearching ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <RecipeCard
                  recipe={item}
                  onPress={() => navigateToRecipe(item.id)}
                />
              </View>
            )}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for a different recipe or ingredient
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for recipes</Text>
          <Text style={styles.emptySubtext}>
            Find recipes by name, ingredient, or category
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
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});