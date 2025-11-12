export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          title: string
          servings: string | null
          ingredients: Ingredient[]
          steps: string[]
          memo: string | null
          category: string | null
          tags: string[]
          image_url: string | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          servings?: string | null
          ingredients: Ingredient[]
          steps: string[]
          memo?: string | null
          category?: string | null
          tags?: string[]
          image_url?: string | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          servings?: string | null
          ingredients?: Ingredient[]
          steps?: string[]
          memo?: string | null
          category?: string | null
          tags?: string[]
          image_url?: string | null
          thumbnail_url?: string | null
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
