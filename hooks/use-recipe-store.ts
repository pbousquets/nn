import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@/types/recipe';

interface RecipeState {
  favorites: string[];
  recentlyViewed: string[];
  userRecipes: Recipe[];
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  addToRecentlyViewed: (recipeId: string) => void;
  addUserRecipe: (recipe: Omit<Recipe, 'id'>) => string;
  updateUserRecipe: (recipe: Recipe) => void;
  deleteUserRecipe: (recipeId: string) => void;
  getUserRecipes: () => Recipe[];
  getUserRecipeById: (recipeId: string) => Recipe | undefined;
}

// Helper to generate a unique ID
const generateId = () => {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyViewed: [],
      userRecipes: [],
      
      addToFavorites: (recipeId: string) => {
        set((state) => ({
          favorites: [...state.favorites, recipeId]
        }));
      },
      
      removeFromFavorites: (recipeId: string) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== recipeId)
        }));
      },
      
      isFavorite: (recipeId: string) => {
        return get().favorites.includes(recipeId);
      },
      
      addToRecentlyViewed: (recipeId: string) => {
        set((state) => {
          // Remove if already exists to avoid duplicates
          const filtered = state.recentlyViewed.filter(id => id !== recipeId);
          // Add to beginning of array and limit to 10 items
          return {
            recentlyViewed: [recipeId, ...filtered].slice(0, 10)
          };
        });
      },

      addUserRecipe: (recipeData) => {
        const id = generateId();
        const newRecipe: Recipe = {
          ...recipeData,
          id
        };
        
        set((state) => ({
          userRecipes: [...state.userRecipes, newRecipe]
        }));
        
        return id;
      },
      
      updateUserRecipe: (updatedRecipe) => {
        set((state) => ({
          userRecipes: state.userRecipes.map(recipe => 
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
          )
        }));
      },
      
      deleteUserRecipe: (recipeId) => {
        set((state) => ({
          userRecipes: state.userRecipes.filter(recipe => recipe.id !== recipeId),
          // Also remove from favorites if it was favorited
          favorites: state.favorites.filter(id => id !== recipeId),
          // Also remove from recently viewed
          recentlyViewed: state.recentlyViewed.filter(id => id !== recipeId)
        }));
      },
      
      getUserRecipes: () => {
        return get().userRecipes;
      },
      
      getUserRecipeById: (recipeId) => {
        return get().userRecipes.find(recipe => recipe.id === recipeId);
      }
    }),
    {
      name: 'recipe-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);