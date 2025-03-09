import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
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
import { ArrowLeft, Check } from 'lucide-react-native';

// Default image URLs for new recipes
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
];

// Get a random image from the default images
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
  return DEFAULT_IMAGES[randomIndex];
};

// Convert categories to options for select input
const categoryOptions = categories ? categories.map(category => ({
  label: category.name,
  value: category.name,
})) : [];

// Difficulty options
const difficultyOptions = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { addUserRecipe } = useRecipeStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  
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
    if (!validateForm()) {
      Alert.alert('Error', 'Please fix the errors in the form before submitting.');
      return;
    }
    
    setLoading(true);
    
    try {
      const newRecipe: Omit<Recipe, 'id'> = {
        title,
        description,
        imageUrl: getRandomImage(),
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
        ingredients,
        instructions,
        category,
        tags,
        isUserCreated: true
      };
      
      const recipeId = addUserRecipe(newRecipe);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      Alert.alert(
        'Success',
        'Recipe created successfully!',
        [
          { 
            text: 'View Recipe', 
            onPress: () => router.push(`/recipe/${recipeId}`) 
          },
          {
            text: 'Go to My Recipes',
            onPress: () => router.push('/my-recipes')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating recipe:', error);
      Alert.alert('Error', 'Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Create Recipe',
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
            {success && (
              <View style={styles.successMessage}>
                <Check size={16} color={colors.success} />
                <Text style={styles.successText}>Recipe created successfully!</Text>
              </View>
            )}
            
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
            
            <Button
              title="Create Recipe"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
              disabled={loading}
            />
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
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight || '#e6f7e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: colors.success,
    marginLeft: 8,
    fontWeight: '500',
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
  submitButton: {
    marginTop: 24,
  },
  backButton: {
    padding: 8,
  },
});