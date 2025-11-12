import { create } from 'zustand'
import { Recipe } from '@/features/recipes/types/recipe.types'

interface RecipeStore {
  recipes: Recipe[]
  selectedRecipeId: string | null
  isLoading: boolean
  error: string | null

  setRecipes: (recipes: Recipe[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  setSelectedRecipeId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  selectedRecipeId: null,
  isLoading: false,
  error: null,

  setRecipes: (recipes) => set({ recipes, error: null }),

  addRecipe: (recipe) =>
    set((state) => ({
      recipes: [recipe, ...state.recipes],
      error: null,
    })),

  updateRecipe: (id, updatedRecipe) =>
    set((state) => ({
      recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...updatedRecipe } : r)),
      error: null,
    })),

  deleteRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== id),
      error: null,
    })),

  setSelectedRecipeId: (id) => set({ selectedRecipeId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
