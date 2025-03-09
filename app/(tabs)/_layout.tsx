import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, User, Calendar, Plus, ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => (
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                router.push('/shopping-list');
              }}
              accessibilityLabel="Shopping List"
            >
              <View style={styles.iconBadge}>
                <ShoppingBag size={22} color={colors.text} />
              </View>
              <Text style={styles.iconLabel}>Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                router.push('/recipe/create');
              }}
              accessibilityLabel="Create Recipe"
            >
              <View style={styles.iconBadge}>
                <Plus size={22} color={colors.text} />
              </View>
              <Text style={styles.iconLabel}>Create</Text>
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meal-plan"
        options={{
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
    alignItems: 'center',
  },
  iconBadge: {
    backgroundColor: colors.grayLight,
    borderRadius: 20,
    padding: 8,
    marginBottom: 2,
  },
  iconLabel: {
    fontSize: 10,
    color: colors.text,
  },
});