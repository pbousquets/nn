import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Plus, Trash2 } from 'lucide-react-native';

interface ListInputProps {
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const ListInput = ({ 
  label, 
  items, 
  onItemsChange, 
  placeholder = 'Add item', 
  error 
}: ListInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      onItemsChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  const handleKeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (Platform.OS === 'web' && nativeEvent.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          onSubmitEditing={handleAddItem}
          onKeyPress={handleKeyPress}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddItem}
          disabled={inputValue.trim() === ''}
        >
          <Plus size={20} color={inputValue.trim() === '' ? colors.textLight : colors.primary} />
        </TouchableOpacity>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemNumberContainer}>
              <Text style={styles.itemNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => handleRemoveItem(index)}
            >
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items added yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    padding: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  itemNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemNumber: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
});