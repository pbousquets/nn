import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useMealPlanStore } from '@/hooks/use-meal-plan-store';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { MealPlanDay } from '@/components/MealPlanDay';
import { Button } from '@/components/Button';
import { Save, Check } from 'lucide-react-native';

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanScreen() {
  const router = useRouter();
  const { mealPlan, clearMealPlan } = useMealPlanStore();
  const { enabledMealTypes } = useSettingsStore();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const navigateToAddMeal = (day: string, mealType: string) => {
    router.push(`/meal-plan/add-meal?day=${day}&mealType=${mealType}`);
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
              mealPlan={mealPlan[day] || {}}
              enabledMealTypes={enabledMealTypes}
              onAddMeal={(mealType) => navigateToAddMeal(day, mealType)}
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
    backgroundColor: colors.successLight,
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