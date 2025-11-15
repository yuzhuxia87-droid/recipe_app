import { supabase } from '@/lib/supabase'
import { Recipe, RecipeFormData } from '../types/recipe.types'
import type { Database } from '@/types/supabase'

type RecipeRow = Database['public']['Tables']['recipes']['Row']
type RecipeInsert = Database['public']['Tables']['recipes']['Insert']
type RecipeUpdate = Database['public']['Tables']['recipes']['Update']

export const recipeService = {
  /**
   * 全レシピ取得（作成日降順）
   */
  async getAll(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // snake_caseをcamelCaseに変換
    return (data || []).map((item: RecipeRow) => ({
      ...item,
      displayTitle: item.display_title,
    })) as Recipe[]
  },

  /**
   * ID指定でレシピ取得
   */
  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null // レコードが見つからない場合
      throw error
    }

    // snake_caseをcamelCaseに変換
    const row = data as RecipeRow
    return {
      ...row,
      displayTitle: row.display_title,
    } as Recipe
  },

  /**
   * レシピ作成
   */
  async create(recipeData: Partial<RecipeFormData>): Promise<Recipe> {
    // RecipeFormData（camelCase）をSupabase schema（snake_case）に変換
    const dbData: RecipeInsert = {
      title: recipeData.title!,
      display_title: recipeData.displayTitle,
      servings: recipeData.servings,
      ingredients: recipeData.ingredients!,
      steps: recipeData.steps!,
      memo: recipeData.memo,
      category: recipeData.category,
      tags: recipeData.tags,
      image_url: recipeData.image_url,
      thumbnail_url: recipeData.thumbnail_url,
      illustrated_url: recipeData.illustrated_url,
      favorite: recipeData.favorite,
    }

    const { data, error } = await supabase
      .from('recipes')
      // @ts-expect-error Supabase CLIで生成した型定義とクライアントの型推論のミスマッチ
      .insert(dbData)
      .select()
      .single()

    if (error) throw error

    // snake_caseをcamelCaseに変換してRecipe型で返す
    const row = data as RecipeRow
    return {
      ...row,
      displayTitle: row.display_title,
    } as Recipe
  },

  /**
   * レシピ更新
   */
  async update(id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> {
    // RecipeFormData（camelCase）をSupabase schema（snake_case）に変換
    const dbData: RecipeUpdate = {
      title: recipeData.title,
      display_title: recipeData.displayTitle,
      servings: recipeData.servings,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      memo: recipeData.memo,
      category: recipeData.category,
      tags: recipeData.tags,
      image_url: recipeData.image_url,
      thumbnail_url: recipeData.thumbnail_url,
      illustrated_url: recipeData.illustrated_url,
      favorite: recipeData.favorite,
    }

    const { data, error } = await supabase
      .from('recipes')
      // @ts-expect-error Supabase CLIで生成した型定義とクライアントの型推論のミスマッチ
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // snake_caseをcamelCaseに変換してRecipe型で返す
    const row = data as RecipeRow
    return {
      ...row,
      displayTitle: row.display_title,
    } as Recipe
  },

  /**
   * レシピ削除
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('recipes').delete().eq('id', id)

    if (error) throw error
  },

  /**
   * レシピ検索（料理名・材料）
   */
  async search(query: string): Promise<Recipe[]> {
    if (!query.trim()) return this.getAll()

    const lowerQuery = query.toLowerCase()

    // まず料理名での検索
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('title', `%${lowerQuery}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    const recipes = (data as Recipe[]) || []

    // 材料での検索も追加（クライアント側でフィルタ）
    const allRecipes = await this.getAll()
    const byIngredients = allRecipes.filter(
      recipe =>
        !recipes.some(r => r.id === recipe.id) && // 既に料理名で見つかったものは除外
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery))
    )

    return [...recipes, ...byIngredients]
  },
}
