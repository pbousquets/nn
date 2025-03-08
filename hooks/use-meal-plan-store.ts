import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlan } from '@/types/recipe';

interface MealPlanState {
  mealPlan: MealPlan;
  recipeUsage: Record<string, { count: number, lastUsed: string }>;
  addMeal: (day: string, mealType: string, recipeId: string) => void;
  removeMeal: (day: string, mealType: string) => void;
  clearMealPlan: () => void;
  getRecommendedRecipes: (count: number) => string[];
  getLastUsedDate: (recipeId: string) => string | null;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      mealPlan: {},
      recipeUsage: {},
      
      addMeal: (day: string, mealType: string, recipeId: string) => {
        set((state) => {
          // Update meal plan
          const newMealPlan = { ...state.mealPlan };
          if (!newMealPlan[day]) {
            newMealPlan[day] = {};
          }
          newMealPlan[day][mealType] = recipeId;
          
          // Update recipe usage
          const newRecipeUsage = { ...state.recipeUsage };
          if (!newRecipeUsage[recipeId]) {
            newRecipeUsage[recipeId] = { count: 0, lastUsed: new Date().toISOString() };
          }
          
          newRecipeUsage[recipeId] = {
            count: newRecipeUsage[recipeId].count + 1,
            lastUsed: new Date().toISOString()
          };
          
          return {
            mealPlan: newMealPlan,
            recipeUsage: newRecipeUsage
          };
        });
      },
      
      removeMeal: (day: string, mealType: string) => {
        set((state) => {
          if (!state.mealPlan[day] || !state.mealPlan[day][mealType]) {
            return state;
          }
          
          const newMealPlan = { ...state.mealPlan };
          delete newMealPlan[day][mealType];
          
          // If day is empty, remove it
          if (Object.keys(newMealPlan[day]).length === 0) {
            delete newMealPlan[day];
          }
          
          return { mealPlan: newMealPlan };
        });
      },
      
      clearMealPlan: () => {
        set({ mealPlan: {} });
      },
      
      getRecommendedRecipes: (count: number) => {
        const { recipeUsage } = get();
        
        // Sort recipes by usage count (descending) and then by last used date (oldest first)
        const sortedRecipes = Object.entries(recipeUsage)
          .sort(([, a], [, b]) => {
            // First sort by count (descending)
            if (b.count !== a.count) {
              return b.count - a.count;
            }
            
            // Then sort by last used date (oldest first)
            return new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
          })
          .map(([id]) => id);
        
        return sortedRecipes.slice(0, count);
      },
      
      getLastUsedDate: (recipeId: string) => {
        const { recipeUsage } = get();
        return recipeUsage[recipeId]?.lastUsed || null;
      }
    }),
    {
      name: 'meal-plan-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);