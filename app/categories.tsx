import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { categories } from '@/mocks/categories';
import { CategoryCard } from '@/components/CategoryCard';
import { ArrowLeft } from 'lucide-react-native';

export default function CategoriesScreen() {
  const router = useRouter();
  
  const navigateToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Categories',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="dark" />
      
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <CategoryCard
              category={item}
              onPress={() => navigateToCategory(item.id)}
            />
          </View>
        )}
        contentContainerStyle={styles.categoriesList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  categoriesList: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    maxWidth: '50%',
    paddingHorizontal: 4,
  },
});