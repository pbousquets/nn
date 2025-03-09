import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealType } from './use-meal-plan-store';

interface SettingsState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  enabledMealTypes: MealType[];
  toggleMealType: (mealType: MealType) => void;
  showRecipeImages: boolean;
  toggleRecipeImages: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      notificationsEnabled: true,
      // Default to lunch and dinner enabled
      enabledMealTypes: ['lunch', 'dinner'],
      showRecipeImages: true,
      
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode 
      })),
      
      toggleNotifications: () => set((state) => ({ 
        notificationsEnabled: !state.notificationsEnabled 
      })),
      
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
      
      toggleRecipeImages: () => {
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