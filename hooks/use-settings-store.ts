import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface SettingsState {
  enabledMealTypes: MealType[];
  showRecipeImages: boolean;
  toggleMealType: (mealType: MealType) => void;
  toggleShowRecipeImages: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default to lunch and dinner enabled
      enabledMealTypes: ['lunch', 'dinner'],
      showRecipeImages: true,
      
      toggleMealType: (mealType: MealType) => {
        set((state) => {
          if (state.enabledMealTypes.includes(mealType)) {
            // Don't allow removing the last meal type
            if (state.enabledMealTypes.length === 1) {
              return state;
            }
            return {
              enabledMealTypes: state.enabledMealTypes.filter(type => type !== mealType)
            };
          } else {
            return {
              enabledMealTypes: [...state.enabledMealTypes, mealType]
            };
          }
        });
      },
      
      toggleShowRecipeImages: () => {
        set((state) => ({
          showRecipeImages: !state.showRecipeImages
        }));
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);