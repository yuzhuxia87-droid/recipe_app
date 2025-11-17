// Ingredient型はsupabase.tsからimport（DRY原則）
import type { Ingredient } from '@/types/supabase'

// 他のモジュールでも使えるように再エクスポート
export type { Ingredient }

export interface Recipe {
  id: string
  title: string
  displayTitle?: string | null // カード表示用の短縮タイトル（AI自動生成、手動編集可能）
  servings?: string | null
  ingredients: Ingredient[]
  steps: string[]
  memo?: string | null
  category?: string | null
  tags?: string[]
  image_url?: string | null
  thumbnail_url?: string | null
  illustrated_url?: string | null // イラスト風変換画像（Phase 6で実装予定）
  favorite?: boolean // お気に入りフラグ
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

// Vision API用の型定義
export interface ExtractedRecipeData {
  title: string // ユーザー入力そのまま（例：「野菜たっぷりズボラビビンバ丼」）
  dishName: string // 正規化された料理名（例：「ビビンバ」）
  dishNameEnglish: string // 英語の料理名（例：「bibimbap」）
  alternativeEnglishNames?: string[] // 代替英語名（例：["omelet rice", "ketchup rice"]）
  dishCategory?: string // 料理カテゴリ（例：「rice dish」「noodle dish」「soup」）
  servings?: string
  ingredients: Ingredient[]
  steps: string[]
  memo?: string
}
