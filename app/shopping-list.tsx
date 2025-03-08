import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useShoppingListStore } from '@/hooks/use-shopping-list-store';
import { Button } from '@/components/Button';
import { ArrowLeft, Plus, Check, X, Save } from 'lucide-react-native';
import { knownIngredients } from '@/mocks/ingredients';

export default function ShoppingListScreen() {
  const router = useRouter();
  const { items, addItem, removeItem, toggleItem, clearCompletedItems } = useShoppingListStore();
  
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    if (newItem.length > 1) {
      const filtered = knownIngredients.filter(
        ingredient => ingredient.toLowerCase().includes(newItem.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newItem]);
  
  const handleAddItem = () => {
    if (newItem.trim()) {
      addItem(newItem.trim());
      setNewItem('');
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setNewItem(suggestion);
    setShowSuggestions(false);
  };
  
  const handleSaveList = () => {
    // In a real app, this would save to a server or perform additional actions
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    Alert.alert('Success', 'Shopping list saved successfully!');
  };
  
  const renderItem = ({ item }: { item: { id: string; name: string; completed: boolean } }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={() => toggleItem(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Check size={16} color={colors.white} />}
        </View>
      </TouchableOpacity>
      
      <Text style={[
        styles.itemText,
        item.completed && styles.itemTextCompleted
      ]}>
        {item.name}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeItem(item.id)}
      >
        <X size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
  
  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: 'Shopping List',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveList} style={styles.headerButton}>
              <Save size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add an item to your shopping list"
              placeholderTextColor={colors.textLight}
              onSubmitEditing={handleAddItem}
            />
            
            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        {saveSuccess && (
          <View style={styles.successMessage}>
            <Check size={16} color={colors.success} />
            <Text style={styles.successText}>Shopping list saved successfully!</Text>
          </View>
        )}
        
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Items to Buy ({pendingItems.length})</Text>
          
          {pendingItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your shopping list is empty</Text>
            </View>
          ) : (
            <FlatList
              data={pendingItems}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              style={styles.list}
            />
          )}
          
          {completedItems.length > 0 && (
            <>
              <View style={styles.completedHeader}>
                <Text style={styles.sectionTitle}>Purchased Items ({completedItems.length})</Text>
                <TouchableOpacity onPress={clearCompletedItems}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={completedItems}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                style={styles.list}
              />
            </>
          )}
        </View>
        
        <Button
          title="Save Shopping List"
          onPress={handleSaveList}
          style={styles.saveButton}
          icon={<Save size={20} color={colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  textInputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1000,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  list: {
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  clearText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 16,
  },
});