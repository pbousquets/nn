export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: string[];
  category: string;
  tags: string[];
  isUserCreated?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MealPlan {
  [day: string]: {
    [mealType: string]: string; // recipeId
  };
}