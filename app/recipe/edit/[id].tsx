import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { FormInput } from '@/components/FormInput';
import { TagInput } from '@/components/TagInput';
import { IngredientInput } from '@/components/IngredientInput';
import { ListInput } from '@/components/ListInput';
import { SelectInput } from '@/components/SelectInput';
import { Button } from '@/components/Button';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { categories } from '@/mocks/categories';
import { Recipe, Ingredient } from '@/types/recipe';
import { ArrowLeft } from 'lucide-react-native';

// Convert categories to options for select input
const categoryOptions = categories.map(category => ({
  label: category.name,
  value: category.name,
}));

// Difficulty options
const difficultyOptions = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateUserRecipe, getUserRecipeById, deleteUserRecipe } = useRecipeStore();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Get the recipe to edit
  const recipe = getUserRecipeById(id);
  
  // If recipe doesn't exist or is not a user recipe, redirect to home
  useEffect(() => {
    if (!recipe) {
      Alert.alert('Error', 'Recipe not found or cannot be edited.');
      router.replace('/');
    }
  }, [recipe, router]);
  
  // Form state
  const [title, setTitle] = useState(recipe?.title || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [category, setCategory] = useState(recipe?.category || '');
  const [prepTime, setPrepTime] = useState(recipe?.prepTime.toString() || '');
  const [cookTime, setCookTime] = useState(recipe?.cookTime.toString() || '');
  const [servings, setServings] = useState(recipe?.servings.toString() || '');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || 'Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || []);
  const [instructions, setInstructions] = useState<string[]>(recipe?.instructions || []);
  const [tags, setTags] = useState<string[]>(recipe?.tags || []);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    
    if (!prepTime.trim()) {
      newErrors.prepTime = 'Prep time is required';
    } else if (isNaN(Number(prepTime)) || Number(prepTime) < 0) {
      newErrors.prepTime = 'Prep time must be a positive number';
    }
    
    if (!cookTime.trim()) {
      newErrors.cookTime = 'Cook time is required';
    } else if (isNaN(Number(cookTime)) || Number(cookTime) < 0) {
      newErrors.cookTime = 'Cook time must be a positive number';
    }
    
    if (!servings.trim()) {
      newErrors.servings = 'Servings is required';
    } else if (isNaN(Number(servings)) || Number(servings) <= 0) {
      newErrors.servings = 'Servings must be a positive number';
    }
    
    if (ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
    if (instructions.length === 0) newErrors.instructions = 'At least one instruction is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm() || !recipe) return;
    
    setLoading(true);
    
    try {
      const updatedRecipe: Recipe = {
        ...recipe,
        title,
        description,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
        ingredients,
        instructions,
        category,
        tags,
      };
      
      updateUserRecipe(updatedRecipe);
      
      Alert.alert(
        'Success',
        'Recipe updated successfully!',
        [
          { 
            text: 'View Recipe', 
            onPress: () => router.push(`/recipe/${recipe.id}`) 
          },
          {
            text: 'Go to My Recipes',
            onPress: () => router.push('/my-recipes')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (!recipe) return;
            
            setDeleteLoading(true);
            try {
              deleteUserRecipe(recipe.id);
              Alert.alert('Success', 'Recipe deleted successfully!');
              router.replace('/my-recipes');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe. Please try again.');
              setDeleteLoading(false);
            }
          },
        },
      ]
    );
  };
  
  if (!recipe) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Edit Recipe',
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
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <FormInput
              label="Recipe Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter recipe title"
              error={errors.title}
            />
            
            <FormInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter a brief description"
              multiline
              numberOfLines={3}
              error={errors.description}
            />
            
            <SelectInput
              label="Category"
              options={categoryOptions}
              value={category}
              onValueChange={setCategory}
              error={errors.category}
            />
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormInput
                  label="Prep Time (min)"
                  value={prepTime}
                  onChangeText={setPrepTime}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.prepTime}
                />
              </View>
              
              <View style={styles.halfWidth}>
                <FormInput
                  label="Cook Time (min)"
                  value={cookTime}
                  onChangeText={setCookTime}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.cookTime}
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <FormInput
                  label="Servings"
                  value={servings}
                  onChangeText={setServings}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.servings}
                />
              </View>
              
              <View style={styles.halfWidth}>
                <SelectInput
                  label="Difficulty"
                  options={difficultyOptions}
                  value={difficulty}
                  onValueChange={setDifficulty}
                />
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Ingredients & Instructions</Text>
            
            <IngredientInput
              label="Ingredients"
              items={ingredients}
              onItemsChange={setIngredients}
              placeholder="Add an ingredient"
              error={errors.ingredients}
            />
            
            <ListInput
              label="Instructions"
              items={instructions}
              onItemsChange={setInstructions}
              placeholder="Add a step"
              error={errors.instructions}
            />
            
            <TagInput
              label="Tags"
              tags={tags}
              onTagsChange={setTags}
              placeholder="Add tags (e.g., healthy, quick)"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Update Recipe"
                onPress={handleSubmit}
                loading={loading}
                style={styles.updateButton}
              />
              
              <Button
                title="Delete Recipe"
                onPress={handleDelete}
                variant="outline"
                loading={deleteLoading}
                style={styles.deleteButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 24,
  },
  updateButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  backButton: {
    padding: 8,
  },
});