import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/hooks/use-settings-store';
import { useRecipeStore } from '@/hooks/use-recipe-store';
import { useShoppingListStore } from '@/hooks/use-shopping-list-store';
import { useChaosModeStore } from '@/hooks/use-chaos-mode';
import { 
  User, 
  Settings, 
  Heart, 
  BookOpen, 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  ChevronRight,
  Coffee,
  Utensils,
  Soup,
  Moon
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { getUserRecipes } = useRecipeStore();
  const { items } = useShoppingListStore();
  const { 
    enabledMealTypes, 
    toggleMealType,
    showRecipeImages,
    toggleShowRecipeImages
  } = useSettingsStore();
  const { isEnabled: chaosMode, toggle: toggleChaosMode } = useChaosModeStore();
  
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  const userRecipes = getUserRecipes();
  const shoppingListItems = items.length;
  
  const handleSignIn = () => {
    Alert.alert(
      'Sign In',
      'This would normally open a sign-in screen. For demo purposes, we\'ll just toggle the signed-in state.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign In',
          onPress: () => setIsSignedIn(true),
        },
      ]
    );
  };
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: () => setIsSignedIn(false),
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <User size={40} color={colors.white} />
            </View>
          </View>
          
          <Text style={styles.username}>
            {isSignedIn ? 'John Doe' : 'Guest User'}
          </Text>
          
          <TouchableOpacity 
            style={styles.authButton}
            onPress={isSignedIn ? handleSignOut : handleSignIn}
          >
            <Text style={styles.authButtonText}>
              {isSignedIn ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userRecipes.length}</Text>
            <Text style={styles.statLabel}>My Recipes</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{shoppingListItems}</Text>
            <Text style={styles.statLabel}>Shopping Items</Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/my-recipes')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
              <BookOpen size={20} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>My Recipes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/favorites')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
              <Heart size={20} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/shopping-list')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.tertiary }]}>
              <ShoppingBag size={20} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>Shopping List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/meal-plan')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.quaternary }]}>
              <Calendar size={20} color={colors.white} />
            </View>
            <Text style={styles.quickActionText}>Meal Plan</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Plan Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Coffee size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Breakfast</Text>
            <Switch
              value={enabledMealTypes.includes('breakfast')}
              onValueChange={() => toggleMealType('breakfast')}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={enabledMealTypes.includes('breakfast') ? colors.primary : colors.gray}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Soup size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Lunch</Text>
            <Switch
              value={enabledMealTypes.includes('lunch')}
              onValueChange={() => toggleMealType('lunch')}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={enabledMealTypes.includes('lunch') ? colors.primary : colors.gray}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Utensils size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Dinner</Text>
            <Switch
              value={enabledMealTypes.includes('dinner')}
              onValueChange={() => toggleMealType('dinner')}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={enabledMealTypes.includes('dinner') ? colors.primary : colors.gray}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Show Recipe Images</Text>
            <Switch
              value={showRecipeImages}
              onValueChange={toggleShowRecipeImages}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={showRecipeImages ? colors.primary : colors.gray}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.settingIconContainer}>
              <Settings size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>App Settings</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Chaos Mode</Text>
            <Switch
              value={chaosMode}
              onValueChange={toggleChaosMode}
              trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
              thumbColor={chaosMode ? colors.primary : colors.gray}
            />
          </View>
          
          {isSignedIn && (
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleSignOut}
            >
              <View style={styles.settingIconContainer}>
                <LogOut size={20} color={colors.error} />
              </View>
              <Text style={[styles.settingText, { color: colors.error }]}>Sign Out</Text>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
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
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  authButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  authButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickAction: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});