import { create } from 'zustand'
import { Recipe } from '@/features/recipes/types/recipe.types'

export type SortOrder = 'newest' | 'oldest' | 'name' | 'favorites-first'

interface RecipeStore {
  // データ（Single Source of Truth）
  allRecipes: Recipe[]
  selectedRecipeId: string | null

  // 検索・フィルタ状態
  searchQuery: string
  sortOrder: SortOrder

  // UI状態
  isLoading: boolean
  error: string | null

  // Computed値を返すセレクタ
  getFilteredRecipes: () => Recipe[]

  // アクション
  setAllRecipes: (recipes: Recipe[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  toggleFavorite: (id: string) => void
  setSelectedRecipeId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  setSortOrder: (order: SortOrder) => void
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  // 初期状態
  allRecipes: [],
  selectedRecipeId: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  sortOrder: 'newest',

  // Selector: 検索クエリに基づいてフィルタされたレシピを返す
  getFilteredRecipes: () => {
    const { allRecipes, searchQuery } = get()

    // 検索クエリがない場合は全件返す
    if (!searchQuery.trim()) {
      return allRecipes
    }

    const lowerQuery = searchQuery.toLowerCase()

    // タイトル・材料名で検索
    return allRecipes.filter(recipe => {
      // タイトル検索
      if (recipe.title.toLowerCase().includes(lowerQuery)) {
        return true
      }

      // displayTitle検索
      if (recipe.displayTitle?.toLowerCase().includes(lowerQuery)) {
        return true
      }

      // 材料名検索
      return recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerQuery)
      )
    })
  },

  // 全レシピをセット
  setAllRecipes: recipes =>
    set({
      allRecipes: recipes,
      error: null,
    }),

  // レシピ追加
  addRecipe: recipe =>
    set(state => ({
      allRecipes: [recipe, ...state.allRecipes],
      error: null,
    })),

  // レシピ更新
  updateRecipe: (id, updatedRecipe) =>
    set(state => ({
      allRecipes: state.allRecipes.map(r =>
        r.id === id ? { ...r, ...updatedRecipe } : r
      ),
      error: null,
    })),

  // レシピ削除
  deleteRecipe: id =>
    set(state => ({
      allRecipes: state.allRecipes.filter(r => r.id !== id),
      error: null,
    })),

  // お気に入りトグル
  toggleFavorite: id =>
    set(state => ({
      allRecipes: state.allRecipes.map(r =>
        r.id === id ? { ...r, favorite: !r.favorite } : r
      ),
    })),

  setSelectedRecipeId: id => set({ selectedRecipeId: id }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  // 検索クエリをセット
  setSearchQuery: query => set({ searchQuery: query }),

  // 検索クリア
  clearSearch: () => set({ searchQuery: '' }),

  // 並び替え順序をセット
  setSortOrder: order => set({ sortOrder: order }),
}))
