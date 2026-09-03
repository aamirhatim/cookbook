import { Timestamp } from 'firebase/firestore';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  timerMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  imageUrl?: string;
  imageStoragePath?: string;
  authorId: string;
  authorName?: string;
  isPrivate: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Data needed to create a new recipe.
 * Omits system-managed fields (id, timestamps, image paths).
 */
export interface CreateRecipeInput {
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  authorId: string;
  authorName?: string;
  isPrivate?: boolean;
}

/**
 * Data for updating an existing recipe.
 * All fields are optional.
 */
export type UpdateRecipeInput = Partial<Omit<CreateRecipeInput, 'authorId'>>;

/**
 * Filter options for querying recipes.
 */
export interface RecipeFilters {
  authorId?: string;
  tag?: string;
  difficulty?: Difficulty;
  includePrivate?: boolean;
  limitCount?: number;
}
