import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { ChevronDown } from 'lucide-react-native';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const SelectInput = ({ 
  label, 
  options, 
  value, 
  onValueChange, 
  placeholder = 'Select an option',
  error
}: SelectInputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [webDropdownVisible, setWebDropdownVisible] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  
  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setModalVisible(false);
    setWebDropdownVisible(false);
  };
  
  const toggleDropdown = () => {
    if (Platform.OS === 'web') {
      setWebDropdownVisible(!webDropdownVisible);
    } else {
      setModalVisible(true);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[styles.selectButton, error && styles.selectButtonError]} 
        onPress={toggleDropdown}
      >
        <Text style={selectedOption ? styles.selectedText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textLight} />
      </TouchableOpacity>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {Platform.OS !== 'web' ? (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.optionItem,
                      item.value === value && styles.selectedOptionItem
                    ]} 
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        item.value === value && styles.selectedOptionText
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      ) : (
        webDropdownVisible && (
          <View style={styles.webDropdown}>
            {options.map((option) => (
              <TouchableOpacity 
                key={option.value}
                style={[
                  styles.webOptionItem,
                  option.value === value && styles.selectedOptionItem
                ]} 
                onPress={() => handleSelect(option.value)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    option.value === value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
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
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectButtonError: {
    borderColor: colors.error,
  },
  selectedText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textLight,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
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
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOptionItem: {
    backgroundColor: colors.primaryLight || '#e6f7e6',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: colors.primary,
  },
  webDropdown: {
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
    maxHeight: 200,
    overflow: 'auto',
  },
  webOptionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});