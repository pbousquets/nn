import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Ingredient } from '@/types/recipe';
import { Plus, X, ChevronDown } from 'lucide-react-native';
import { knownIngredients } from '@/mocks/ingredients';

interface IngredientInputProps {
  label: string;
  items: Ingredient[];
  onItemsChange: (items: Ingredient[]) => void;
  placeholder?: string;
  error?: string;
}

export const IngredientInput = ({ 
  label, 
  items, 
  onItemsChange, 
  placeholder = 'Add an item', 
  error 
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [amountValue, setAmountValue] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  const units = [
    'g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pinch', 'piece', 'slice', 'clove', 'bunch'
  ];

  useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = knownIngredients.filter(
        ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const newItem: Ingredient = {
        name: inputValue.trim(),
        amount: amountValue ? parseFloat(amountValue) : 0,
        unit: unitValue
      };
      
      onItemsChange([...items, newItem]);
      setInputValue('');
      setAmountValue('');
      setUnitValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const handleSelectUnit = (unit: string) => {
    setUnitValue(unit);
    setUnitModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputRow}>
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            value={amountValue}
            onChangeText={setAmountValue}
            placeholder="Amt"
            keyboardType="numeric"
            placeholderTextColor={colors.textLight}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.unitContainer}
          onPress={() => setUnitModalVisible(true)}
        >
          <Text style={unitValue ? styles.unitText : styles.unitPlaceholder}>
            {unitValue || 'Unit'}
          </Text>
          <ChevronDown size={16} color={colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor={colors.textLight}
            onFocus={() => inputValue.length > 1 && setSuggestions(
              knownIngredients.filter(
                ingredient => ingredient.toLowerCase().includes(inputValue.toLowerCase())
              ).slice(0, 5)
            )}
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
        
        <TouchableOpacity 
          style={[
            styles.addButton,
            !inputValue.trim() && styles.addButtonDisabled
          ]} 
          onPress={handleAddItem}
          disabled={!inputValue.trim()}
        >
          <Plus size={20} color={inputValue.trim() ? colors.white : 'rgba(255,255,255,0.5)'} />
        </TouchableOpacity>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.amount > 0 ? `${item.amount} ${item.unit} ` : ''}{item.name}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(index)}
              >
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {Platform.OS !== 'web' ? (
        <Modal
          visible={unitModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setUnitModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Unit</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setUnitModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={units}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.unitItem} 
                    onPress={() => handleSelectUnit(item)}
                  >
                    <Text style={styles.unitItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      ) : (
        unitModalVisible && (
          <View style={styles.webUnitDropdown}>
            {units.map((unit) => (
              <TouchableOpacity 
                key={unit}
                style={styles.webUnitItem} 
                onPress={() => handleSelectUnit(unit)}
              >
                <Text style={styles.unitItemText}>{unit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountContainer: {
    width: 60,
    marginRight: 8,
  },
  amountInput: {
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  unitContainer: {
    width: 80,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 16,
    color: colors.text,
  },
  unitPlaceholder: {
    fontSize: 16,
    color: colors.textLight,
  },
  nameInputContainer: {
    flex: 1,
    position: 'relative',
  },
  nameInput: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.gray || '#cccccc',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  itemsContainer: {
    marginTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  unitItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unitItemText: {
    fontSize: 16,
    color: colors.text,
  },
  webUnitDropdown: {
    position: 'absolute',
    top: 80,
    left: 60,
    width: 120,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1000,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    overflow: 'auto',
  },
  webUnitItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});