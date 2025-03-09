import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanItem {
  id: string;
  day: WeekDay;
  mealType: MealType;
  recipeId: string;
}

interface MealPlanState {
  mealPlan: Record<string, Record<string, string>>;
  recipeUsage: Record<string, { count: number, lastUsed: string }>;
  mealPlanItems: MealPlanItem[];
  addMeal: (day: string, mealType: string, recipeId: string) => void;
  removeMeal: (day: string, mealType: string) => void;
  clearMealPlan: () => void;
  getRecommendedRecipes: (count: number) => string[];
  getLastUsedDate: (recipeId: string) => string | null;
}

// Helper to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      mealPlan: {},
      recipeUsage: {},
      mealPlanItems: [], // Initialize as empty array
      
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
          
          // Update meal plan items
          const newMealPlanItems = Array.isArray(state.mealPlanItems) ? [...state.mealPlanItems] : [];
          
          // Remove existing item for this day/mealType if it exists
          const existingItemIndex = newMealPlanItems.findIndex(
            item => item && item.day === day && item.mealType === mealType
          );
          
          if (existingItemIndex !== -1) {
            newMealPlanItems.splice(existingItemIndex, 1);
          }
          
          // Add new item
          newMealPlanItems.push({
            id: generateId(),
            day: day as WeekDay,
            mealType: mealType as MealType,
            recipeId
          });
          
          return {
            mealPlan: newMealPlan,
            recipeUsage: newRecipeUsage,
            mealPlanItems: newMealPlanItems
          };
        });
      },
      
      removeMeal: (day: string, mealType: string) => {
        set((state) => {
          // Create a copy of the current state
          const newMealPlan = { ...state.mealPlan };
          const newMealPlanItems = Array.isArray(state.mealPlanItems) ? [...state.mealPlanItems] : [];
          
          // Check if the day exists in the meal plan
          if (newMealPlan[day]) {
            // Check if the meal type exists for this day
            if (newMealPlan[day][mealType]) {
              // Remove the meal type from this day
              delete newMealPlan[day][mealType];
              
              // If day is empty, remove it
              if (Object.keys(newMealPlan[day]).length === 0) {
                delete newMealPlan[day];
              }
            }
          }
          
          // Filter out the removed meal from mealPlanItems
          const filteredItems = newMealPlanItems.filter(
            item => item && !(item.day === day && item.mealType === mealType)
          );
          
          return { 
            ...state,
            mealPlan: newMealPlan,
            mealPlanItems: filteredItems
          };
        });
      },
      
      clearMealPlan: () => {
        set({ 
          mealPlan: {},
          mealPlanItems: []
        });
      },
      
      getRecommendedRecipes: (count: number) => {
        const { recipeUsage } = get();
        
        // If no recipe usage data, return empty array
        if (!recipeUsage || Object.keys(recipeUsage).length === 0) {
          return [];
        }
        
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
        return recipeUsage && recipeUsage[recipeId] ? recipeUsage[recipeId].lastUsed : null;
      }
    }),
    {
      name: 'meal-plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add version and migration logic if needed in the future
      version: 1,
    }
  )
);