import React from 'react';
import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native';
import { colors } from '@/constants/colors';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput = ({ 
  label, 
  error, 
  value, 
  onChangeText, 
  placeholder,
  multiline,
  numberOfLines,
  keyboardType,
  ...rest 
}: FormInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.multilineInput,
          error ? styles.inputError : null
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  input: {
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});