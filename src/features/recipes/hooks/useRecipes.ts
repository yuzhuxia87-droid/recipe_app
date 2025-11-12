import { useEffect } from 'react'
import { recipeService } from '../services/recipeService'
import { useRecipeStore } from '@/store/recipeStore'
import { RecipeFormData } from '../types/recipe.types'

export function useRecipes() {
  const { recipes, setRecipes, addRecipe, updateRecipe, deleteRecipe, setLoading, setError } =
    useRecipeStore()

  // 初回ロード
  useEffect(() => {
    loadRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await recipeService.getAll()
      setRecipes(data)
    } catch (error) {
      console.error('レシピ取得エラー:', error)
      setError('レシピの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const createRecipe = async (recipeData: Partial<RecipeFormData>) => {
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
  }

  const updateRecipeById = async (id: string, recipeData: Partial<RecipeFormData>) => {
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
  }

  const deleteRecipeById = async (id: string) => {
    try {
      setError(null)
      await recipeService.delete(id)
      deleteRecipe(id)
    } catch (error) {
      console.error('レシピ削除エラー:', error)
      setError('レシピの削除に失敗しました')
      throw error
    }
  }

  const searchRecipes = async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      const results = await recipeService.search(query)
      setRecipes(results)
    } catch (error) {
      console.error('検索エラー:', error)
      setError('検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return {
    recipes,
    createRecipe,
    updateRecipe: updateRecipeById,
    deleteRecipe: deleteRecipeById,
    searchRecipes,
    refreshRecipes: loadRecipes,
  }
}
