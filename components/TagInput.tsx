import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { X } from 'lucide-react-native';

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const TagInput = ({ 
  label, 
  tags, 
  onTagsChange, 
  placeholder = 'Add tag and press Enter', 
  error 
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      const newTag = inputValue.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = ({ nativeEvent }: { nativeEvent: { key: string } }) => {
    if (Platform.OS === 'web' && nativeEvent.key === 'Enter') {
      handleAddTag();
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
          onSubmitEditing={handleAddTag}
          onKeyPress={handleKeyPress}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddTag}
          disabled={inputValue.trim() === ''}
        >
          <Text style={[
            styles.addButtonText,
            inputValue.trim() === '' ? styles.addButtonTextDisabled : null
          ]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
            <TouchableOpacity 
              onPress={() => handleRemoveTag(tag)}
              style={styles.removeButton}
            >
              <X size={14} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: colors.textLight,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 14,
    color: colors.textLight,
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
});