export interface Ingredient {
  name: string
  amount: string
}

export interface Recipe {
  id: string
  title: string
  servings?: string | null
  ingredients: Ingredient[]
  steps: string[]
  memo?: string | null
  category?: string | null
  tags?: string[]
  image_url?: string | null
  thumbnail_url?: string | null
  created_at: string
  updated_at: string
}

export type RecipeFormData = Omit<Recipe, 'id' | 'created_at' | 'updated_at'>

export interface RecipeSearchParams {
  query?: string
  category?: string
  tags?: string[]
  sortBy?: 'created_at' | 'title'
  sortOrder?: 'asc' | 'desc'
}
