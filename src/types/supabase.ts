export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          title: string
          display_title: string | null // カード表示用タイトル追加
          servings: string | null
          ingredients: Ingredient[]
          steps: string[]
          memo: string | null
          category: string | null
          tags: string[]
          image_url: string | null
          thumbnail_url: string | null
          illustrated_url: string | null
          favorite: boolean // お気に入りフラグ追加
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          display_title?: string | null
          servings?: string | null
          ingredients: Ingredient[]
          steps: string[]
          memo?: string | null
          category?: string | null
          tags?: string[]
          image_url?: string | null
          thumbnail_url?: string | null
          illustrated_url?: string | null
          favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          display_title?: string | null
          servings?: string | null
          ingredients?: Ingredient[]
          steps?: string[]
          memo?: string | null
          category?: string | null
          tags?: string[]
          image_url?: string | null
          thumbnail_url?: string | null
          illustrated_url?: string | null
          favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface Ingredient {
  name: string
  amount: string
}
