import { Recipe } from '@/types/recipe';
import { categories } from './categories';
import { useRecipeStore } from '@/hooks/use-recipe-store';

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Avocado Toast with Poached Eggs',
    description: 'A delicious and nutritious breakfast that\'s quick to prepare and packed with healthy fats and protein.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 slices of sourdough bread',
      '1 ripe avocado',
      '2 eggs',
      '1 tbsp white vinegar',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Fresh herbs like cilantro or chives (optional)'
    ],
    instructions: [
      'Toast the bread until golden and crispy.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
      'Mash the avocado with a fork and season with salt and pepper.',
      'Bring a pot of water to a gentle simmer and add vinegar.',
      'Crack each egg into a small cup, then gently slide into the simmering water.',
      'Cook for 3-4 minutes until the whites are set but yolks are still runny.',
      'Spread the mashed avocado on the toast.',
      'Using a slotted spoon, remove the poached eggs and place on top of the avocado.',
      'Season with salt, pepper, and optional toppings.'
    ],
    category: 'Breakfast',
    tags: ['healthy', 'vegetarian', 'high-protein'],
    isFeatured: true,
    rating: 4.8,
    calories: 350,
    protein: 15,
    carbs: 30,
    fat: 20
  },
  {
    id: '2',
    title: 'Creamy Tomato Basil Pasta',
    description: 'A comforting pasta dish with a rich tomato sauce and fresh basil.',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '12 oz pasta (penne or spaghetti)',
      '2 tbsp olive oil',
      '3 cloves garlic, minced',
      '1 onion, finely chopped',
      '28 oz canned crushed tomatoes',
      '1/2 cup heavy cream',
      '1/4 cup fresh basil leaves, torn',
      '1/2 cup grated Parmesan cheese',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)'
    ],
    instructions: [
      'Cook pasta according to package instructions until al dente. Drain and set aside.',
      'In a large skillet, heat olive oil over medium heat.',
      'Add onion and cook until translucent, about 3-4 minutes.',
      'Add garlic and cook for another minute until fragrant.',
      'Pour in crushed tomatoes and simmer for 10 minutes.',
      'Reduce heat to low and stir in heavy cream.',
      'Add cooked pasta to the sauce and toss to coat.',
      'Mix in torn basil leaves and half of the Parmesan cheese.',
      'Season with salt, pepper, and red pepper flakes if desired.',
      'Serve hot, topped with remaining Parmesan cheese.'
    ],
    category: 'Dinner',
    tags: ['pasta', 'italian', 'comfort food'],
    isFeatured: true,
    rating: 4.6,
    calories: 450,
    protein: 12,
    carbs: 65,
    fat: 18
  },
  {
    id: '3',
    title: 'Berry Smoothie Bowl',
    description: 'A refreshing and nutritious smoothie bowl topped with fresh fruits and granola.',
    imageUrl: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 frozen banana',
      '1 cup mixed frozen berries',
      '1/2 cup Greek yogurt',
      '1/4 cup almond milk',
      '1 tbsp honey or maple syrup',
      'Toppings: fresh berries, sliced banana, granola, chia seeds, coconut flakes'
    ],
    instructions: [
      'Add frozen banana, berries, yogurt, almond milk, and sweetener to a blender.',
      'Blend until smooth and creamy. Add more almond milk if needed.',
      'Pour into a bowl.',
      'Arrange toppings in an attractive pattern.',
      'Serve immediately.'
    ],
    category: 'Breakfast',
    tags: ['healthy', 'vegetarian', 'quick'],
    rating: 4.7,
    calories: 320,
    protein: 10,
    carbs: 60,
    fat: 5
  },
  {
    id: '4',
    title: 'Grilled Chicken Salad',
    description: 'A hearty salad with grilled chicken, fresh vegetables, and a zesty dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '2 boneless, skinless chicken breasts',
      '2 tbsp olive oil',
      '1 tsp Italian seasoning',
      '6 cups mixed salad greens',
      '1 cup cherry tomatoes, halved',
      '1 cucumber, sliced',
      '1/2 red onion, thinly sliced',
      '1/4 cup crumbled feta cheese',
      '1/4 cup sliced almonds',
      'For dressing: 3 tbsp olive oil, 1 tbsp lemon juice, 1 tsp Dijon mustard, 1 clove garlic (minced), salt and pepper'
    ],
    instructions: [
      'Season chicken with olive oil, Italian seasoning, salt, and pepper.',
      'Grill chicken for 6-7 minutes per side until cooked through.',
      'Let chicken rest for 5 minutes, then slice.',
      'In a small bowl, whisk together dressing ingredients.',
      'In a large bowl, combine salad greens, tomatoes, cucumber, and red onion.',
      'Toss with dressing.',
      'Top with sliced chicken, feta cheese, and almonds.',
      'Serve immediately.'
    ],
    category: 'Lunch',
    tags: ['healthy', 'high-protein', 'salad'],
    rating: 4.5,
    calories: 380,
    protein: 30,
    carbs: 15,
    fat: 22
  },
  {
    id: '5',
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade chocolate chip cookies that are soft in the middle and crispy on the edges.',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 10,
    servings: 24,
    difficulty: 'Easy',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup unsalted butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup packed brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups semi-sweet chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, mix flour, baking soda, and salt.',
      'In a large bowl, beat butter and sugars until creamy.',
      'Add eggs one at a time, then stir in vanilla.',
      'Gradually blend in the dry ingredients.',
      'Stir in chocolate chips.',
      'Drop rounded tablespoons of dough onto ungreased baking sheets.',
      'Bake for 9 to 11 minutes or until golden brown.',
      'Cool on baking sheets for 2 minutes, then transfer to wire racks.'
    ],
    category: 'Desserts',
    tags: ['baking', 'dessert', 'cookies'],
    rating: 4.9,
    calories: 150,
    protein: 2,
    carbs: 20,
    fat: 8
  },
  {
    id: '6',
    title: 'Vegetable Stir Fry',
    description: 'A quick and colorful vegetable stir fry with a savory sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '2 tbsp vegetable oil',
      '2 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup broccoli florets',
      '1 cup snap peas',
      '1 cup mushrooms, sliced',
      'For sauce: 3 tbsp soy sauce, 1 tbsp rice vinegar, 1 tbsp honey, 1 tsp sesame oil, 1 tsp cornstarch',
      '2 green onions, sliced',
      '1 tbsp sesame seeds'
    ],
    instructions: [
      'In a small bowl, mix all sauce ingredients and set aside.',
      'Heat oil in a large wok or skillet over high heat.',
      'Add garlic and ginger, stir for 30 seconds until fragrant.',
      'Add vegetables, starting with the ones that take longer to cook (carrots, broccoli).',
      'Stir fry for 5-6 minutes until vegetables are crisp-tender.',
      'Pour sauce over vegetables and stir to coat.',
      'Cook for another 1-2 minutes until sauce thickens.',
      'Garnish with green onions and sesame seeds.',
      'Serve hot with rice or noodles.'
    ],
    category: 'Vegetarian',
    tags: ['vegetarian', 'quick', 'healthy'],
    isFeatured: true,
    rating: 4.4,
    calories: 180,
    protein: 5,
    carbs: 25,
    fat: 7
  },
  {
    id: '7',
    title: '15-Minute Quesadillas',
    description: 'Quick and delicious cheese quesadillas with optional add-ins.',
    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '4 large flour tortillas',
      '2 cups shredded Mexican cheese blend',
      '1 tbsp vegetable oil',
      'Optional add-ins: cooked chicken, black beans, corn, diced bell peppers, jalapeños',
      'For serving: salsa, guacamole, sour cream'
    ],
    instructions: [
      'Heat a large skillet over medium heat.',
      'Place one tortilla in the skillet.',
      'Sprinkle half of the cheese evenly over the tortilla.',
      'Add any optional ingredients on top of the cheese.',
      'Place another tortilla on top.',
      'Cook for 2-3 minutes until bottom is golden brown.',
      'Carefully flip and cook for another 2-3 minutes.',
      'Remove from skillet and cut into wedges.',
      'Repeat with remaining ingredients.',
      'Serve with salsa, guacamole, and sour cream.'
    ],
    category: 'Quick & Easy',
    tags: ['quick', 'mexican', 'kid-friendly'],
    rating: 4.3,
    calories: 450,
    protein: 18,
    carbs: 40,
    fat: 25
  },
  {
    id: '8',
    title: 'Classic Beef Burger',
    description: 'Juicy homemade beef burgers with all the fixings.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '1.5 lbs ground beef (80/20)',
      '1 tsp Worcestershire sauce',
      '1 tsp garlic powder',
      '1 tsp onion powder',
      'Salt and pepper to taste',
      '4 hamburger buns',
      'Toppings: lettuce, tomato, onion, pickles, cheese slices',
      'Condiments: ketchup, mustard, mayonnaise'
    ],
    instructions: [
      'In a large bowl, combine ground beef, Worcestershire sauce, garlic powder, onion powder, salt, and pepper.',
      'Gently mix with your hands, being careful not to overwork the meat.',
      'Divide into 4 equal portions and form into patties about 1/2 inch thick.',
      'Press a slight indent in the center of each patty with your thumb.',
      'Heat a grill or skillet to medium-high heat.',
      'Cook patties for 4-5 minutes per side for medium doneness.',
      'If adding cheese, place on patties during the last minute of cooking.',
      'Toast the buns lightly if desired.',
      'Assemble burgers with desired toppings and condiments.'
    ],
    category: 'Dinner',
    tags: ['beef', 'american', 'grill'],
    rating: 4.7,
    calories: 520,
    protein: 30,
    carbs: 30,
    fat: 32
  }
];

// Get all recipes (default + user recipes)
export const getAllRecipes = () => {
  const { getUserRecipes } = useRecipeStore.getState();
  return [...recipes, ...getUserRecipes()];
};

export const getFeaturedRecipes = () => {
  return recipes.filter(recipe => recipe.isFeatured);
};

export const getRecipesByCategory = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)?.name;
  if (!category) return [];
  
  const { getUserRecipes } = useRecipeStore.getState();
  const userRecipes = getUserRecipes().filter(recipe => recipe.category === category);
  const defaultRecipes = recipes.filter(recipe => recipe.category === category);
  
  return [...defaultRecipes, ...userRecipes];
};

export const getRecipeById = (id: string) => {
  // Check if it's a user recipe first
  const { getUserRecipeById } = useRecipeStore.getState();
  const userRecipe = getUserRecipeById(id);
  if (userRecipe) return userRecipe;
  
  // If not, check default recipes
  return recipes.find(recipe => recipe.id === id);
};

export const searchRecipes = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  
  // Search in default recipes
  const defaultResults = recipes.filter(
    recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      recipe.category.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
  
  // Search in user recipes
  const { getUserRecipes } = useRecipeStore.getState();
  const userResults = getUserRecipes().filter(
    recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      recipe.category.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
  
  return [...defaultResults, ...userResults];
};