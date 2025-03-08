import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingListState {
  items: ShoppingItem[];
  addItem: (name: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearCompletedItems: () => void;
  addItems: (names: string[]) => void;
}

// Helper to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (name: string) => {
        set((state) => {
          // Check if item already exists (case insensitive)
          const existingItem = state.items.find(
            item => item.name.toLowerCase() === name.toLowerCase()
          );
          
          if (existingItem) {
            // If it exists but is completed, mark it as not completed
            if (existingItem.completed) {
              return {
                items: state.items.map(item => 
                  item.id === existingItem.id ? { ...item, completed: false } : item
                )
              };
            }
            // Otherwise, don't add a duplicate
            return state;
          }
          
          // Add new item
          return {
            items: [
              ...state.items,
              {
                id: generateId(),
                name,
                completed: false
              }
            ]
          };
        });
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      toggleItem: (id: string) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        }));
      },
      
      clearCompletedItems: () => {
        set((state) => ({
          items: state.items.filter(item => !item.completed)
        }));
      },
      
      addItems: (names: string[]) => {
        set((state) => {
          const newItems = [...state.items];
          
          names.forEach(name => {
            // Check if item already exists (case insensitive)
            const existingItem = newItems.find(
              item => item.name.toLowerCase() === name.toLowerCase()
            );
            
            if (existingItem) {
              // If it exists but is completed, mark it as not completed
              if (existingItem.completed) {
                const index = newItems.findIndex(item => item.id === existingItem.id);
                newItems[index] = { ...existingItem, completed: false };
              }
              // Otherwise, don't add a duplicate
            } else {
              // Add new item
              newItems.push({
                id: generateId(),
                name,
                completed: false
              });
            }
          });
          
          return { items: newItems };
        });
      }
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);