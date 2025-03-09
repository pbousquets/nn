import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { MealPlanItem, MealType, WeekDay } from '@/hooks/use-meal-plan-store';
import { getRecipeById } from '@/mocks/recipes';
import { Plus, X } from 'lucide-react-native';

interface MealPlanDayProps {
  day: WeekDay;
  date: string;
  mealPlanItems: MealPlanItem[];
  onAddMeal: (mealType: MealType) => void;
  onPressItem: (item: MealPlanItem) => void;
  onRemoveMeal: (day: WeekDay, mealType: MealType) => void;
  enabledMealTypes: MealType[];
}

const MEAL_TYPES: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Breakfast' },
  { type: 'lunch', label: 'Lunch' },
  { type: 'dinner', label: 'Dinner' },
  { type: 'snack', label: 'Snack' },
];

const formatDay = (day: WeekDay): string => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const MealPlanDay = ({ 
  day, 
  date, 
  mealPlanItems = [], // Provide default empty array
  onAddMeal,
  onPressItem,
  onRemoveMeal,
  enabledMealTypes = [] // Provide default empty array
}: MealPlanDayProps) => {
  // Ensure mealPlanItems is an array
  const items = Array.isArray(mealPlanItems) ? mealPlanItems : [];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dayText}>{formatDay(day)}</Text>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
      </View>
      
      <View style={styles.mealsContainer}>
        {MEAL_TYPES.filter(meal => 
          Array.isArray(enabledMealTypes) && enabledMealTypes.includes(meal.type)
        ).map(({ type, label }) => {
          // Safely filter items
          const mealItems = items.filter(item => item && item.mealType === type);
          
          return (
            <View key={type} style={styles.mealSection}>
              <Text style={styles.mealTypeText}>{label}</Text>
              
              {mealItems.length > 0 ? (
                mealItems.map(item => {
                  const recipe = getRecipeById(item.recipeId);
                  
                  if (!recipe) return null;
                  
                  return (
                    <View key={item.id} style={styles.mealItemContainer}>
                      <TouchableOpacity 
                        style={styles.mealItem}
                        onPress={() => onPressItem(item)}
                      >
                        <Text style={styles.mealItemText} numberOfLines={1}>
                          {recipe.title}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => onRemoveMeal(day, type)}
                      >
                        <X size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <TouchableOpacity 
                  style={styles.addMealButton}
                  onPress={() => onAddMeal(type)}
                >
                  <Plus size={16} color={colors.primary} />
                  <Text style={styles.addMealText}>Add {label}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  dateText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  mealsContainer: {
    padding: 16,
  },
  mealSection: {
    marginBottom: 12,
  },
  mealTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  mealItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealItem: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    padding: 12,
  },
  mealItemText: {
    fontSize: 14,
    color: colors.text,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addMealText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
});