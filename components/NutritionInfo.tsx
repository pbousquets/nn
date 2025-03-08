import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

interface NutritionInfoProps {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export const NutritionInfo = ({ calories, protein, carbs, fat }: NutritionInfoProps) => {
  if (!calories && !protein && !carbs && !fat) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Information</Text>
      <View style={styles.infoContainer}>
        {calories && (
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{calories}</Text>
            <Text style={styles.infoLabel}>Calories</Text>
          </View>
        )}
        
        {protein && (
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{protein}g</Text>
            <Text style={styles.infoLabel}>Protein</Text>
          </View>
        )}
        
        {carbs && (
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{carbs}g</Text>
            <Text style={styles.infoLabel}>Carbs</Text>
          </View>
        )}
        
        {fat && (
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{fat}g</Text>
            <Text style={styles.infoLabel}>Fat</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
});