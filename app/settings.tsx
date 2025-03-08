import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { ArrowLeft, Calendar, Image, Moon, Bell } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    isDarkMode, 
    toggleDarkMode,
    notificationsEnabled,
    toggleNotifications,
    enabledMealTypes,
    toggleMealType,
    showRecipeImages,
    toggleRecipeImages
  } = useSettingsStore();

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="dark" />
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.grayLight}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Image size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingText}>Show Recipe Images in Selection</Text>
            </View>
            <Switch
              value={showRecipeImages}
              onValueChange={toggleRecipeImages}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.grayLight}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.text} style={styles.settingIcon} />
              <Text style={styles.settingText}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.grayLight}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Planning</Text>
          <Text style={styles.sectionDescription}>
            Select which meal types to include in your meal plan
          </Text>
          
          {mealTypes.map(meal => (
            <View key={meal.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Calendar size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>{meal.label}</Text>
              </View>
              <Switch
                value={enabledMealTypes.includes(meal.id as any)}
                onValueChange={() => toggleMealType(meal.id as any)}
                trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.grayLight}
              />
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  dangerButton: {
    backgroundColor: colors.error,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});