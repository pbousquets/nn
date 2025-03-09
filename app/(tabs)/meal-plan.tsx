import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useMealPlanStore, WeekDay, MealType, MealPlanItem } from '@/hooks/use-meal-plan-store';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { MealPlanDay } from '@/components/MealPlanDay';
import { Button } from '@/components/Button';
import { Save, Check } from 'lucide-react-native';

// Days of the week
const DAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Get formatted date for each day of the current week
const getWeekDates = (): Record<WeekDay, string> => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  
  const dates: Record<WeekDay, string> = {} as Record<WeekDay, string>;
  
  DAYS.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    dates[day] = date.toISOString();
  });
  
  return dates;
};

export default function MealPlanScreen() {
  const router = useRouter();
  const { mealPlanItems = [], clearMealPlan, removeMeal } = useMealPlanStore();
  const { enabledMealTypes = [] } = useSettingsStore();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [weekDates] = useState(getWeekDates());
  
  // Group meal plan items by day
  const getMealPlanItemsByDay = (day: WeekDay): MealPlanItem[] => {
    if (!mealPlanItems || !Array.isArray(mealPlanItems)) {
      return [];
    }
    return mealPlanItems.filter(item => item && item.day === day);
  };
  
  const navigateToAddMeal = (day: WeekDay, mealType: MealType) => {
    router.push(`/meal-plan/add-meal?day=${day}&mealType=${mealType}`);
  };
  
  const handleRemoveMeal = (day: WeekDay, mealType: MealType) => {
    Alert.alert(
      'Remove Meal',
      'Are you sure you want to remove this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeMeal(day, mealType);
            Alert.alert('Success', 'Meal removed successfully!');
          },
        },
      ]
    );
  };
  
  const handleClearMealPlan = () => {
    Alert.alert(
      'Clear Meal Plan',
      'Are you sure you want to clear the entire meal plan? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearMealPlan();
            Alert.alert('Success', 'Meal plan cleared successfully!');
          },
        },
      ]
    );
  };
  
  const handleSaveMealPlan = () => {
    // In a real app, this would save to a server or perform additional actions
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    Alert.alert('Success', 'Meal plan saved successfully!');
  };
  
  const handlePressItem = (item: MealPlanItem) => {
    router.push(`/recipe/${item.recipeId}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Meal Plan</Text>
          <Text style={styles.subtitle}>Plan your meals for the week</Text>
        </View>
        
        {saveSuccess && (
          <View style={styles.successMessage}>
            <Check size={16} color={colors.success} />
            <Text style={styles.successText}>Meal plan saved successfully!</Text>
          </View>
        )}
        
        <View style={styles.content}>
          {DAYS.map((day) => (
            <MealPlanDay
              key={day}
              day={day}
              date={weekDates[day]}
              mealPlanItems={getMealPlanItemsByDay(day)}
              enabledMealTypes={enabledMealTypes}
              onAddMeal={(mealType) => navigateToAddMeal(day, mealType)}
              onPressItem={handlePressItem}
              onRemoveMeal={handleRemoveMeal}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Meal Plan"
            onPress={handleSaveMealPlan}
            style={styles.saveButton}
            icon={<Save size={20} color={colors.white} />}
          />
          
          <Button
            title="Clear Meal Plan"
            onPress={handleClearMealPlan}
            variant="outline"
            style={styles.clearButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight || '#e6f7e6',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  successText: {
    color: colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  clearButton: {
    borderColor: colors.error,
  },
});