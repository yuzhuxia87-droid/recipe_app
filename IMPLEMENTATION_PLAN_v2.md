# 料理日記・レシピ手帳アプリ 実装計画書 v2.0

**改訂版: GitHub + Vercel + Supabase 構成**

---

## 📋 目次
1. [技術スタック](#技術スタック)
2. [なぜこの構成？](#なぜこの構成)
3. [プロジェクト構成](#プロジェクト構成)
4. [開発フェーズ](#開発フェーズ)
5. [詳細実装計画](#詳細実装計画)
6. [データベース設計](#データベース設計)
7. [デプロイ・運用](#デプロイ運用)

---

## 🛠 技術スタック

### コア技術
| カテゴリ | 選択技術 | 理由 |
|---------|---------|------|
| **フレームワーク** | Vite + React 18 + TypeScript | 2025年標準、高速開発、型安全性 |
| **状態管理** | Zustand | 軽量（1KB）、シンプル |
| **データベース** | **Supabase (PostgreSQL)** | クラウドDB、複数デバイス対応、無料枠充実 |
| **画像ストレージ** | **Supabase Storage** | 大容量、CDN配信、無料枠1GB |
| **ルーティング** | React Router v6 | 成熟、情報豊富 |
| **スタイリング** | Tailwind CSS + daisyUI | 高速開発、手帳風デザイン |
| **画像処理** | browser-image-compression | 高品質圧縮 |
| **コード管理** | **GitHub** | バージョン管理、バックアップ |
| **デプロイ** | **Vercel** | GitHub連携、自動デプロイ |
| **画像解析** | Claude Vision API | $5無料枠 |

### 補助技術
- **テスト**: Vitest + React Testing Library
- **Lint/Format**: ESLint 9 + Prettier
- **フォント**: Google Fonts（Klee One - 手書き風）

---

## 🤔 なぜこの構成？

### IndexedDB → Supabase に変更した理由

| 項目 | IndexedDB（旧） | **Supabase（新）** |
|-----|----------------|------------------|
| **データ保存場所** | ブラウザ内 | クラウド |
| **複数デバイス** | ❌ 不可 | ✅ 自動同期 |
| **データ消失リスク** | ⚠️ ブラウザクリアで消える | ✅ 安全 |
| **画像容量** | ⚠️ 制限あり | ✅ 1GB無料 |
| **実装の簡単さ** | 普通 | **✅ より簡単** |
| **学習価値** | ブラウザAPI | **✅ 実務で使える技術** |

### GitHub を追加した理由
- コードのバージョン管理（間違えても戻せる）
- バックアップ（PCが壊れてもコードが残る）
- Vercelと連携して自動デプロイ

### Vercel を選んだ理由
- GitHub連携が超簡単（プッシュするだけで自動デプロイ）
- 設定ファイルほぼ不要
- 無料枠が充実

---

## 📁 プロジェクト構成

### ディレクトリ構造（Feature-based Architecture）

```
recipe-app/
├── .github/                      # GitHub Actions（CI/CD）
│   └── workflows/
│       └── ci.yml
├── public/                       # 静的ファイル
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── features/                 # 機能別モジュール
│   │   ├── recipes/              # レシピ機能
│   │   │   ├── components/       # RecipeCard, RecipeForm等
│   │   │   ├── hooks/            # useRecipes, useRecipeSearch等
│   │   │   ├── services/         # recipeService.ts (Supabase操作)
│   │   │   ├── types/            # recipe.types.ts
│   │   │   └── index.ts
│   │   ├── search/               # 検索機能
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   └── imageAnalysis/        # 画像解析機能
│   │       ├── components/
│   │       ├── services/
│   │       └── index.ts
│   ├── shared/                   # 共通
│   │   ├── components/           # Button, Modal等
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── lib/                      # 外部サービス設定
│   │   ├── supabase.ts           # Supabaseクライアント
│   │   └── claudeVision.ts       # Claude API
│   ├── store/                    # Zustand stores
│   │   ├── recipeStore.ts
│   │   ├── uiStore.ts
│   │   └── settingsStore.ts
│   ├── routes/                   # ルーティング
│   │   └── index.tsx
│   ├── assets/
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/                     # Supabase設定（ローカル開発用）
│   ├── migrations/               # DBマイグレーション
│   └── seed.sql                  # テストデータ
├── .env.example
├── .env.local                    # Git無視
├── .gitignore
├── eslint.config.js
├── package.json
├── prettier.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 開発フェーズ

### **開発期間: 2-3週間（IndexedDB版より1週間短縮）**

### Phase 0: 事前準備（30分）
- GitHubアカウント確認
- Supabaseアカウント作成
- Vercelアカウント作成
- 必要なツールのインストール確認

### Phase 1: プロジェクト＆Supabaseセットアップ（1日）
- GitHubリポジトリ作成
- Viteプロジェクト作成
- Supabaseプロジェクト作成
- データベーステーブル作成
- 環境変数設定
- 初回コミット＆プッシュ

**成果物**: GitHubにプッシュされた空のReactアプリ + Supabase接続確認

---

### Phase 2: レシピ基本機能（MVP）（3-4日）
- Supabase CRUD操作実装
- レシピ一覧表示
- レシピ詳細表示
- レシピ手動入力フォーム
- 基本的な手帳風デザイン

**成果物**: 手動でレシピを追加・閲覧・削除できるアプリ

---

### Phase 3: 画像機能（2日）
- 画像アップロード
- Supabase Storageに保存
- 画像圧縮
- サムネイル生成
- 画像プレビュー表示

**成果物**: 画像付きレシピ管理

---

### Phase 4: 検索・フィルター（1-2日）
- 料理名検索
- 材料検索
- 作成日ソート
- PostgreSQL全文検索活用

**成果物**: レシピを素早く見つけられる検索機能

---

### Phase 5: 候補画像グリッド表示（2日）
- 候補画像の3列グリッド表示
- 画像選択UI
- 選択画像のプレビュー

**成果物**: メイン体験の候補選択フロー

---

### Phase 6: 画像解析統合（2-3日）
- Claude Vision API統合
- 画像からテキスト抽出
- 料理名・材料・手順の自動認識
- ユーザー修正UI

**成果物**: 画像から自動でレシピ情報を抽出

---

### Phase 7: デザイン仕上げ（2日）
- 手帳風デザイン細部調整
- レスポンシブ対応
- アクセシビリティ対応
- ローディング・エラー表示改善

**成果物**: プロダクション品質のアプリ

---

### Phase 8: Vercelデプロイ＆テスト（1日）
- Vercel連携
- 環境変数設定
- 本番デプロイ
- 主要機能テスト
- README作成

**成果物**: 公開URLでアクセスできるアプリ

---

## 📝 詳細実装計画

---

## Phase 0: 事前準備

### タスク1: アカウント準備

#### GitHub
1. https://github.com にアクセス
2. アカウント作成（既にある場合はスキップ）

#### Supabase
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントで認証

#### Vercel
1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで認証

### タスク2: ツール確認

```bash
# Node.js バージョン確認（v18以上推奨）
node -v

# npm バージョン確認
npm -v

# Git バージョン確認
git --version
```

---

## Phase 1: プロジェクト＆Supabaseセットアップ

### タスク1: GitHubリポジトリ作成

```bash
# GitHub上で新しいリポジトリ作成
# リポジトリ名: recipe-app
# Private / Public どちらでもOK
```

### タスク2: Viteプロジェクト作成

```bash
# プロジェクト作成
npm create vite@latest recipe-app -- --template react-ts
cd recipe-app
npm install
```

### タスク3: 依存関係インストール

```bash
# Supabase クライアント
npm install @supabase/supabase-js

# コア依存関係
npm install react-router-dom zustand browser-image-compression

# Tailwind CSS + daisyUI
npm install -D tailwindcss postcss autoprefixer daisyui
npx tailwindcss init -p

# 開発ツール
npm install -D eslint @eslint/js typescript-eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-jsx-a11y

# テスト
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### タスク4: Supabaseプロジェクト作成

1. **Supabaseダッシュボードにアクセス**: https://app.supabase.com
2. **「New project」をクリック**
3. **プロジェクト設定**:
   - Name: `recipe-app`
   - Database Password: 強力なパスワード（メモしておく）
   - Region: `Northeast Asia (Tokyo)` ← 日本から最速
   - Pricing Plan: `Free`

4. **プロジェクト作成完了まで待つ**（約2分）

### タスク5: データベーステーブル作成

Supabaseダッシュボード → SQL Editor → New query

```sql
-- recipesテーブル作成
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  servings TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps TEXT[] NOT NULL DEFAULT '{}'::text[],
  memo TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  image_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（検索高速化）
CREATE INDEX idx_recipes_title ON recipes USING gin(to_tsvector('japanese', title));
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_tags ON recipes USING gin(tags);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 設定
-- 今回は個人利用なのでシンプルに全アクセス許可
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for all users" ON recipes
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**「RUN」をクリックして実行**

### タスク6: Supabase Storage バケット作成

1. **Storage → Create a new bucket**
2. **バケット設定**:
   - Name: `recipe-images`
   - Public bucket: ✅ チェック（画像を公開アクセス可能に）
3. **Create bucket**

### タスク7: 環境変数設定

**Supabaseダッシュボード → Settings → API**

以下の情報をコピー:
- `Project URL`
- `anon public` key

**.env.local 作成**:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Claude Vision API（後で設定）
VITE_CLAUDE_API_KEY=
```

**.env.example 作成**:

```bash
# Supabase（実際の値は.env.localに記載）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude Vision API
VITE_CLAUDE_API_KEY=your_claude_api_key
```

### タスク8: Supabaseクライアント設定

**src/lib/supabase.ts**:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**src/types/supabase.ts**（型定義）:

```typescript
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
```

### タスク9: 設定ファイル作成

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

**tailwind.config.js**:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F9F6F0',
        ink: '#2C2C2C',
        accent: '#D4A574',
        cream: '#FFF9E6',
      },
      fontFamily: {
        handwriting: ['Klee One', 'cursive'],
        serif: ['Noto Serif JP', 'serif'],
        sans: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake"],
  },
}
```

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**eslint.config.js**:

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
```

**prettier.config.js**:

```javascript
export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid'
}
```

**.gitignore**:

```
# dependencies
node_modules/

# production
dist/
build/

# env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# misc
*.log
```

**package.json (scripts追加)**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  }
}
```

### タスク10: Git初期化＆GitHubにプッシュ

```bash
# Git初期化
git init

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "chore: プロジェクト初期セットアップ"

# GitHubリモートリポジトリを追加（URLは自分のリポジトリに置き換え）
git remote add origin https://github.com/your-username/recipe-app.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

### タスク11: ディレクトリ構造作成

```bash
mkdir -p src/{features/{recipes,search,imageAnalysis}/{components,hooks,services,types},shared/{components,hooks,utils,types},lib,store,routes,assets,styles}
```

### タスク12: 動作確認

```bash
# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:5173 にアクセスして、Viteのデフォルト画面が表示されればOK！

---

## Phase 2: レシピ基本機能（MVP）

### タスク1: 型定義作成

**src/features/recipes/types/recipe.types.ts**:

```typescript
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
```

### タスク2: Recipe Service作成（Supabase操作）

**src/features/recipes/services/recipeService.ts**:

```typescript
import { supabase } from '@/lib/supabase'
import { Recipe, RecipeFormData } from '../types/recipe.types'

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
    return data as Recipe[]
  },

  /**
   * ID指定でレシピ取得
   */
  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Recipe
  },

  /**
   * レシピ作成
   */
  async create(recipeData: RecipeFormData): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single()

    if (error) throw error
    return data as Recipe
  },

  /**
   * レシピ更新
   */
  async update(id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update(recipeData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Recipe
  },

  /**
   * レシピ削除
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * レシピ検索（料理名・材料）
   */
  async search(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase()

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .or(`title.ilike.%${lowerQuery}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 材料でのフィルタリング（クライアント側）
    const filtered = (data as Recipe[]).filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery))
    )

    return filtered
  }
}
```

### タスク3: Zustand Store作成

**src/store/recipeStore.ts**:

```typescript
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
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  selectedRecipeId: null,
  isLoading: false,
  error: null,

  setRecipes: (recipes) => set({ recipes }),

  addRecipe: (recipe) =>
    set((state) => ({ recipes: [recipe, ...state.recipes] })),

  updateRecipe: (id, updatedRecipe) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...updatedRecipe } : r
      )
    })),

  deleteRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== id)
    })),

  setSelectedRecipeId: (id) => set({ selectedRecipeId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))
```

### タスク4: カスタムフック作成

**src/features/recipes/hooks/useRecipes.ts**:

```typescript
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
  }, [])

  const loadRecipes = async () => {
    try {
      setLoading(true)
      const data = await recipeService.getAll()
      setRecipes(data)
    } catch (error) {
      console.error('レシピ取得エラー:', error)
      setError('レシピの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const createRecipe = async (recipeData: RecipeFormData) => {
    try {
      const newRecipe = await recipeService.create(recipeData)
      addRecipe(newRecipe)
      return newRecipe
    } catch (error) {
      console.error('レシピ作成エラー:', error)
      throw error
    }
  }

  const updateRecipeById = async (id: string, recipeData: Partial<RecipeFormData>) => {
    try {
      const updated = await recipeService.update(id, recipeData)
      updateRecipe(id, updated)
      return updated
    } catch (error) {
      console.error('レシピ更新エラー:', error)
      throw error
    }
  }

  const deleteRecipeById = async (id: string) => {
    try {
      await recipeService.delete(id)
      deleteRecipe(id)
    } catch (error) {
      console.error('レシピ削除エラー:', error)
      throw error
    }
  }

  const searchRecipes = async (query: string) => {
    try {
      setLoading(true)
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
    refreshRecipes: loadRecipes
  }
}
```

### タスク5: 共通コンポーネント作成

**src/shared/components/Button.tsx**:

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'btn'
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-error'
  }
  const sizeStyles = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

**src/shared/components/LoadingSpinner.tsx**:

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <span className="loading loading-spinner loading-lg text-accent"></span>
    </div>
  )
}
```

### タスク6〜10: コンポーネント作成

（RecipeCard, RecipeList, RecipeForm, RecipeDetailは前回の計画書と同じ内容なので省略。Supabase対応のために`id`の型を`number`から`string`に変更するだけ）

### タスク11: Gitコミット＆プッシュ

```bash
git add .
git commit -m "feat(recipe): レシピ基本機能実装（CRUD）"
git push
```

---

## Phase 3: 画像機能

### タスク1: 画像アップロードサービス作成

**src/features/recipes/services/imageService.ts**:

```typescript
import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

const BUCKET_NAME = 'recipe-images'

export const imageService = {
  /**
   * 画像圧縮
   */
  async compressImage(file: File, maxSizeMB = 1): Promise<Blob> {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    }

    try {
      return await imageCompression(file, options)
    } catch (error) {
      console.error('画像圧縮エラー:', error)
      throw error
    }
  },

  /**
   * サムネイル生成
   */
  async createThumbnail(file: File): Promise<Blob> {
    return await imageCompression(file, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 300,
      useWebWorker: true,
      fileType: 'image/webp'
    })
  },

  /**
   * Supabase Storageに画像アップロード
   */
  async uploadImage(file: Blob, fileName: string): Promise<string> {
    const filePath = `${Date.now()}_${fileName}`

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: 'image/webp',
        upsert: false
      })

    if (error) throw error

    // 公開URLを取得
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return data.publicUrl
  },

  /**
   * 画像削除
   */
  async deleteImage(imageUrl: string): Promise<void> {
    // URLからファイルパスを抽出
    const urlParts = imageUrl.split('/')
    const filePath = urlParts[urlParts.length - 1]

    if (!filePath) return

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error
  },

  /**
   * 画像とサムネイルを両方アップロード
   */
  async uploadImageWithThumbnail(file: File): Promise<{
    imageUrl: string
    thumbnailUrl: string
  }> {
    const [compressedImage, thumbnail] = await Promise.all([
      this.compressImage(file),
      this.createThumbnail(file)
    ])

    const [imageUrl, thumbnailUrl] = await Promise.all([
      this.uploadImage(compressedImage, `full_${file.name}`),
      this.uploadImage(thumbnail, `thumb_${file.name}`)
    ])

    return { imageUrl, thumbnailUrl }
  }
}
```

### タスク2: 画像アップロードコンポーネント

**src/features/recipes/components/ImageUpload.tsx**:

```typescript
import { useState, ChangeEvent } from 'react'
import { Button } from '@/shared/components/Button'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  currentImageUrl?: string | null
}

export function ImageUpload({ onImageSelect, currentImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // プレビュー生成
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onImageSelect(file)
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold">料理の写真（任意）</span>
      </label>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="プレビュー"
            className="w-full h-64 object-cover rounded-lg border-2 border-accent/20"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
      />
      <label className="label">
        <span className="label-text-alt text-gray-600">
          JPG, PNG, WEBP形式（最大10MB）
        </span>
      </label>
    </div>
  )
}
```

### タスク3: RecipeFormに画像機能追加

**src/features/recipes/components/RecipeForm.tsx** に追加:

```typescript
import { ImageUpload } from './ImageUpload'
import { imageService } from '../services/imageService'

// ... 既存のstateに追加
const [selectedImage, setSelectedImage] = useState<File | null>(null)
const [isUploading, setIsUploading] = useState(false)

// submitハンドラーを修正
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsUploading(true)

  try {
    let imageUrl: string | undefined
    let thumbnailUrl: string | undefined

    // 画像がある場合はアップロード
    if (selectedImage) {
      const urls = await imageService.uploadImageWithThumbnail(selectedImage)
      imageUrl = urls.imageUrl
      thumbnailUrl = urls.thumbnailUrl
    }

    const recipeData = {
      title,
      servings,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      steps: steps.filter(step => step.trim() !== ''),
      memo,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl
    }

    await createRecipe(recipeData)
    navigate('/')
  } catch (error) {
    console.error('レシピの保存に失敗しました:', error)
    alert('レシピの保存に失敗しました')
  } finally {
    setIsUploading(false)
  }
}

// フォーム内に追加
<ImageUpload onImageSelect={setSelectedImage} />

// 保存ボタンを修正
<Button type="submit" variant="primary" disabled={isUploading}>
  {isUploading ? '保存中...' : '保存する'}
</Button>
```

### タスク4: RecipeCardに画像表示

**src/features/recipes/components/RecipeCard.tsx** 修正:

```typescript
export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      className="card bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-accent/20"
      onClick={onClick}
    >
      {recipe.thumbnail_url && (
        <figure className="px-4 pt-4">
          <img
            src={recipe.thumbnail_url}
            alt={recipe.title}
            className="rounded-lg h-48 w-full object-cover"
            loading="lazy"
          />
        </figure>
      )}
      <div className="card-body">
        <h3 className="card-title font-handwriting text-ink">{recipe.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(recipe.created_at).toLocaleDateString('ja-JP')}
        </p>
        {recipe.memo && (
          <p className="text-sm text-gray-700 line-clamp-2">{recipe.memo}</p>
        )}
      </div>
    </div>
  )
}
```

### タスク5: Gitコミット＆プッシュ

```bash
git add .
git commit -m "feat(recipe): 画像アップロード・表示機能実装"
git push
```

---

## Phase 4〜8の概要

（詳細は実装時に展開。基本的な流れは同じ）

**Phase 4: 検索・フィルター**
- PostgreSQLの全文検索活用
- デバウンス処理

**Phase 5: 候補画像グリッド**
- 3列グリッドレイアウト
- 画像選択UI

**Phase 6: Claude Vision API統合**
- 画像解析サービス作成
- エラーハンドリング

**Phase 7: デザイン仕上げ**
- 手帳風デザイン適用
- レスポンシブ対応

**Phase 8: Vercelデプロイ**
- GitHub連携
- 環境変数設定
- 自動デプロイ

---

## 📊 データベース設計

### recipesテーブル

| カラム | 型 | 説明 |
|-------|---|------|
| id | UUID | プライマリキー |
| title | TEXT | 料理名 |
| servings | TEXT | 分量（例: 2人分） |
| ingredients | JSONB | 材料リスト |
| steps | TEXT[] | 手順リスト |
| memo | TEXT | メモ |
| category | TEXT | カテゴリ |
| tags | TEXT[] | タグ |
| image_url | TEXT | 画像URL |
| thumbnail_url | TEXT | サムネイルURL |
| created_at | TIMESTAMPTZ | 作成日時 |
| updated_at | TIMESTAMPTZ | 更新日時 |

### インデックス

- `idx_recipes_title`: 料理名での全文検索用（GINインデックス）
- `idx_recipes_created_at`: 作成日降順ソート用
- `idx_recipes_tags`: タグ検索用（GINインデックス）

---

## 🚀 デプロイ・運用

### Vercelデプロイ手順

#### 1. Vercelでプロジェクト作成

1. https://vercel.com にアクセス
2. 「Add New... → Project」をクリック
3. GitHubリポジトリを選択: `recipe-app`
4. 「Import」をクリック

#### 2. 環境変数設定

「Environment Variables」セクションで以下を設定:

```
Name: VITE_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: VITE_CLAUDE_API_KEY
Value: sk-ant-api03-...
```

#### 3. デプロイ

「Deploy」をクリック → 自動デプロイ開始（約2分）

#### 4. 完了

デプロイ完了後、公開URLが表示されます:
```
https://recipe-app-xxxxxxxxx.vercel.app
```

### 自動デプロイ

以降、GitHubにプッシュするたびに自動でVercelにデプロイされます:

```bash
git add .
git commit -m "feat: 新機能追加"
git push
# → Vercelが自動でデプロイ開始
```

---

## ✅ 開発チェックリスト

### Phase 0: 事前準備
- [ ] GitHubアカウント確認
- [ ] Supabaseアカウント作成
- [ ] Vercelアカウント作成
- [ ] Node.js/npm/Git確認

### Phase 1: セットアップ
- [ ] GitHubリポジトリ作成
- [ ] Viteプロジェクト作成
- [ ] Supabaseプロジェクト作成
- [ ] データベーステーブル作成
- [ ] Storageバケット作成
- [ ] 環境変数設定
- [ ] 設定ファイル作成
- [ ] Git初期化＆プッシュ

### Phase 2: MVP
- [ ] 型定義作成
- [ ] Recipe Service実装
- [ ] Zustand Store作成
- [ ] useRecipes Hook作成
- [ ] 共通コンポーネント
- [ ] RecipeCard実装
- [ ] RecipeList実装
- [ ] RecipeForm実装
- [ ] RecipeDetail実装
- [ ] ルーティング設定

### Phase 3: 画像機能
- [ ] imageService実装
- [ ] ImageUpload実装
- [ ] RecipeFormに画像機能統合
- [ ] RecipeCardに画像表示
- [ ] Gitコミット＆プッシュ

### Phase 4: 検索
- [ ] SearchBar実装
- [ ] 検索機能統合
- [ ] Gitコミット＆プッシュ

### Phase 5: 候補グリッド
- [ ] 3列グリッドレイアウト
- [ ] 画像選択UI
- [ ] Gitコミット＆プッシュ

### Phase 6: 画像解析
- [ ] Claude Vision API統合
- [ ] テキスト抽出処理
- [ ] ユーザー修正UI
- [ ] Gitコミット＆プッシュ

### Phase 7: デザイン仕上げ
- [ ] 手帳風デザイン適用
- [ ] レスポンシブ対応
- [ ] アクセシビリティ対応
- [ ] Gitコミット＆プッシュ

### Phase 8: デプロイ
- [ ] Vercel連携
- [ ] 環境変数設定
- [ ] デプロイ確認
- [ ] README作成

---

## 📚 参考資料

### 公式ドキュメント
- [Supabase](https://supabase.com/docs)
- [Vercel](https://vercel.com/docs)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Supabase関連
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [PostgreSQL Full Text Search](https://supabase.com/docs/guides/database/full-text-search)

---

## 🎯 成功指標

### 開発完了の定義
- ✅ すべてのPhaseのタスクが完了
- ✅ Vercelにデプロイ済み
- ✅ Supabaseでデータ管理
- ✅ 画像アップロード・表示機能動作
- ✅ 検索機能動作
- ✅ 個人で実際に使える状態

### 品質基準
- TypeScript エラー 0件
- ESLint エラー 0件
- コンソールエラー 0件
- レスポンシブ対応
- GitHubで適切にコミット管理

---

## 💡 IndexedDB版との違い

| 項目 | IndexedDB版 | Supabase版 |
|-----|------------|-----------|
| **データ保存** | ブラウザ内 | クラウド |
| **複数デバイス** | ❌ | ✅ |
| **画像容量** | 制限あり | 1GB無料 |
| **実装難易度** | 普通 | **簡単** |
| **開発期間** | 3-4週間 | **2-3週間** |
| **将来の拡張** | 限定的 | **簡単** |

---

## 🚨 よくあるエラーと対処法

### Supabase接続エラー
```
Error: Invalid Supabase URL
```
**対処**: `.env.local`の`VITE_SUPABASE_URL`を確認

### 画像アップロードエラー
```
Error: new row violates row-level security policy
```
**対処**: Supabaseダッシュボード → Storage → Policies で公開ポリシー確認

### Vercelデプロイエラー
```
Error: Missing environment variables
```
**対処**: Vercelダッシュボードで環境変数を設定

---

**作成日**: 2025-11-12
**バージョン**: 2.0.0
**構成**: GitHub + Vercel + Supabase
