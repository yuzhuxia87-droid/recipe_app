import { useEffect, useCallback } from 'react'
import { recipeService } from '../services/recipeService'
import { useRecipeStore } from '@/store/recipeStore'
import { RecipeFormData } from '../types/recipe.types'

/**
 * レシピ管理用カスタムフック
 *
 * State管理とデータフェッチを統合
 * - Single Source of Truth: allRecipesのみ保持
 * - recipes: getFilteredRecipes()で派生
 * - 検索はクライアント側でフィルタリング
 */
export function useRecipes() {
  const {
    allRecipes,
    searchQuery,
    getFilteredRecipes,
    setAllRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    setLoading,
    setError,
    setSearchQuery,
    clearSearch,
  } = useRecipeStore()

  // フィルタされたレシピを取得
  const recipes = getFilteredRecipes()

  // 初回ロード
  useEffect(() => {
    loadRecipes()
  }, []) // loadRecipesは安定した関数なのでOK

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await recipeService.getAll()
      setAllRecipes(data)
    } catch (error) {
      console.error('レシピ取得エラー:', error)
      setError('レシピの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setAllRecipes])

  const createRecipe = useCallback(
    async (recipeData: Partial<RecipeFormData>) => {
      try {
        setError(null)
        const newRecipe = await recipeService.create(recipeData)
        addRecipe(newRecipe)
        return newRecipe
      } catch (error) {
        console.error('レシピ作成エラー:', error)
        setError('レシピの作成に失敗しました')
        throw error
      }
    },
    [setError, addRecipe]
  )

  const updateRecipeById = useCallback(
    async (id: string, recipeData: Partial<RecipeFormData>) => {
      try {
        setError(null)
        const updated = await recipeService.update(id, recipeData)
        updateRecipe(id, updated)
        return updated
      } catch (error) {
        console.error('レシピ更新エラー:', error)
        setError('レシピの更新に失敗しました')
        throw error
      }
    },
    [setError, updateRecipe]
  )

  const deleteRecipeById = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await recipeService.delete(id)
        deleteRecipe(id)
      } catch (error) {
        console.error('レシピ削除エラー:', error)
        setError('レシピの削除に失敗しました')
        throw error
      }
    },
    [setError, deleteRecipe]
  )

  const getRecipeById = useCallback(
    async (id: string) => {
      // キャッシュチェック（パフォーマンス向上）
      const cached = allRecipes.find(r => r.id === id)
      if (cached) {
        console.log('🎯 キャッシュヒット:', id)
        return cached
      }

      // APIから取得
      try {
        setLoading(true)
        setError(null)
        const data = await recipeService.getById(id)
        return data
      } catch (error) {
        console.error('レシピ取得エラー:', error)
        setError('レシピの取得に失敗しました')
        throw error
      } finally {
        setLoading(false)
      }
    },
    [allRecipes, setLoading, setError]
  )

  const toggleFavoriteById = useCallback(
    async (id: string) => {
      try {
        // 現在の状態を取得
        const recipe = allRecipes.find(r => r.id === id)
        if (!recipe) {
          console.warn(`レシピ ID ${id} が見つかりません`)
          return
        }

        const newFavoriteState = !recipe.favorite

        // Supabase を更新
        await recipeService.update(id, { favorite: newFavoriteState })

        // Zustand ストアを更新
        updateRecipe(id, { favorite: newFavoriteState })

        console.log(`✅ お気に入り状態を更新: ${recipe.title} → ${newFavoriteState ? 'ON' : 'OFF'}`)
      } catch (error) {
        console.error('お気に入り更新エラー:', error)
        setError('お気に入りの更新に失敗しました')
        throw error
      }
    },
    [allRecipes, setError, updateRecipe]
  )

  // 検索処理：クエリをセットするだけ（実際のフィルタはgetFilteredRecipesで行う）
  const searchRecipes = useCallback(
    (query: string) => {
      setSearchQuery(query)
    },
    [setSearchQuery]
  )

  return {
    recipes,
    allRecipes,
    searchQuery,
    createRecipe,
    updateRecipe: updateRecipeById,
    deleteRecipe: deleteRecipeById,
    getRecipeById,
    toggleFavorite: toggleFavoriteById,
    searchRecipes,
    clearSearch,
    refreshRecipes: loadRecipes,
  }
}
