import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipes } from '@/mocks/recipes';
import { categories } from '@/mocks/categories';

interface ChaosModeState {
  isEnabled: boolean;
  toggleChaosMode: () => void;
  secretTapCount: number;
  incrementSecretTapCount: () => void;
  resetSecretTapCount: () => void;
  getRandomRecipe: () => string;
  getRandomCategory: () => string;
  getRandomFunnyTitle: () => string;
  getRandomEmoji: () => string;
  getRandomColor: () => string;
}

// Fun food-related emojis
const FOOD_EMOJIS = ['🍕', '🌮', '🍔', '🍦', '🍩', '🍗', '🥗', '🍜', '🍣', '🍇', '🍓', '🥑', '🍆', '🌶️', '🥕'];

// Funny recipe titles
const FUNNY_TITLES = [
  "Disaster in the Kitchen",
  "What's That Smell?",
  "Mystery Meat Monday",
  "Burnt to Perfection",
  "I Can't Believe It's Edible",
  "Chef's Surprise (Even to the Chef)",
  "Leftover Roulette",
  "Fridge Cleanout Special",
  "Cooking Without Looking",
  "Midnight Munchies Madness",
  "Panic-Cooked Dinner",
  "Last Resort Recipe",
  "Experimental Cuisine",
  "Questionable Choices Casserole",
  "Chaos in a Bowl"
];

// Vibrant colors for chaos mode
const CHAOS_COLORS = [
  '#FF5733', // Bright red-orange
  '#33FF57', // Bright green
  '#3357FF', // Bright blue
  '#FF33F5', // Bright pink
  '#F5FF33', // Bright yellow
  '#33FFF5', // Bright cyan
  '#FF5733', // Bright orange
  '#8A33FF', // Bright purple
  '#FF3333', // Bright red
  '#33FFBD'  // Bright teal
];

export const useChaosModeStore = create<ChaosModeState>()(
  persist(
    (set, get) => ({
      isEnabled: false,
      secretTapCount: 0,
      
      toggleChaosMode: () => set((state) => ({ 
        isEnabled: !state.isEnabled,
        secretTapCount: 0
      })),
      
      incrementSecretTapCount: () => set((state) => ({ 
        secretTapCount: state.secretTapCount + 1 
      })),
      
      resetSecretTapCount: () => set({ secretTapCount: 0 }),
      
      getRandomRecipe: () => {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        return recipes[randomIndex].id;
      },
      
      getRandomCategory: () => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex].id;
      },
      
      getRandomFunnyTitle: () => {
        const randomIndex = Math.floor(Math.random() * FUNNY_TITLES.length);
        return FUNNY_TITLES[randomIndex];
      },
      
      getRandomEmoji: () => {
        const randomIndex = Math.floor(Math.random() * FOOD_EMOJIS.length);
        return FOOD_EMOJIS[randomIndex];
      },
      
      getRandomColor: () => {
        const randomIndex = Math.floor(Math.random() * CHAOS_COLORS.length);
        return CHAOS_COLORS[randomIndex];
      }
    }),
    {
      name: 'chaos-mode-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);