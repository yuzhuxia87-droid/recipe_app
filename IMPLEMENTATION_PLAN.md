# 料理日記・レシピ手帳アプリ 実装計画書

## 📋 目次
1. [技術スタック](#技術スタック)
2. [プロジェクト構成](#プロジェクト構成)
3. [開発フェーズ](#開発フェーズ)
4. [詳細実装計画](#詳細実装計画)
5. [データ設計](#データ設計)
6. [デプロイ・運用](#デプロイ運用)

---

## 🛠 技術スタック

### コア技術
| カテゴリ | 選択技術 | 理由 |
|---------|---------|------|
| **フレームワーク** | Vite + React 18 + TypeScript | 2025年標準、高速開発、型安全性 |
| **状態管理** | Zustand | 軽量（1KB）、ボイラープレート不要 |
| **データベース** | Dexie.js (IndexedDB) | 大容量対応、React Hooks対応 |
| **ルーティング** | React Router v6 | 成熟、情報豊富、初心者向き |
| **スタイリング** | Tailwind CSS + daisyUI | 高速開発、一貫性、手帳風デザイン対応 |
| **画像処理** | browser-image-compression | 高品質圧縮、WebP対応 |
| **テスト** | Vitest + React Testing Library | Vite統合、高速 |
| **Lint/Format** | ESLint 9 (Flat Config) + Prettier | 2025年標準設定 |

### 補助技術
- **PWA対応**: vite-plugin-pwa（オフライン対応）
- **画像解析**: Claude Vision API（$5無料枠活用）
- **デプロイ**: Netlify（無料枠、シンプル）
- **フォント**: Google Fonts（Klee One - 手書き風）

---

## 📁 プロジェクト構成

### ディレクトリ構造（Feature-based Architecture）

```
recipe-app/
├── public/                       # 静的ファイル
│   ├── favicon.ico
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src/
│   ├── features/                 # 機能別モジュール
│   │   ├── recipes/              # レシピ機能
│   │   │   ├── components/       # RecipeCard, RecipeForm等
│   │   │   ├── hooks/            # useRecipes, useRecipeSearch等
│   │   │   ├── services/         # recipeService.ts (DB操作)
│   │   │   ├── types/            # recipe.types.ts
│   │   │   └── index.ts          # 公開API
│   │   ├── search/               # 検索機能
│   │   │   ├── components/       # SearchBar, FilterPanel等
│   │   │   ├── hooks/            # useSearch等
│   │   │   └── index.ts
│   │   └── imageAnalysis/        # 画像解析機能
│   │       ├── components/       # ImageUpload, CandidateGrid等
│   │       ├── services/         # claudeVisionService.ts
│   │       └── index.ts
│   ├── shared/                   # 共通コンポーネント・ユーティリティ
│   │   ├── components/           # Button, Modal, LoadingSpinner等
│   │   ├── hooks/                # useOnlineStatus, useDebounce等
│   │   ├── utils/                # dateFormat, logger等
│   │   └── types/                # common.types.ts
│   ├── store/                    # Zustand stores
│   │   ├── recipeStore.ts        # レシピ状態管理
│   │   ├── uiStore.ts            # UI状態（モーダル等）
│   │   └── settingsStore.ts      # アプリ設定
│   ├── db/                       # Dexie.js データベース定義
│   │   └── recipeDb.ts
│   ├── routes/                   # ルーティング設定
│   │   └── index.tsx
│   ├── assets/                   # 静的アセット
│   │   ├── fonts/
│   │   └── images/
│   ├── styles/                   # グローバルスタイル
│   │   └── index.css
│   ├── App.tsx                   # ルートコンポーネント
│   ├── main.tsx                  # エントリーポイント
│   └── vite-env.d.ts             # 型定義
├── .env.example                  # 環境変数テンプレート
├── .env.local                    # ローカル環境変数（Git無視）
├── .gitignore
├── eslint.config.js              # ESLint設定（Flat Config）
├── netlify.toml                  # Netlifyデプロイ設定
├── package.json
├── postcss.config.js             # PostCSS設定
├── prettier.config.js            # Prettier設定
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
└── vite.config.ts                # Vite設定

```

---

## 🚀 開発フェーズ

### Phase 1: プロジェクトセットアップ（1日）
- Viteプロジェクト作成
- 依存関係インストール
- ESLint/Prettier設定
- Tailwind CSS + daisyUI導入
- 基本的なディレクトリ構造作成
- Git初期化・初回コミット

**成果物**: 動作する空のReactアプリ

---

### Phase 2: データ基盤構築（2日）
- Dexie.jsデータベース定義
- Zustand Store作成（recipeStore）
- 型定義（Recipe, Ingredient等）
- CRUD操作の実装
- 簡単なテストデータ投入

**成果物**: IndexedDBへのレシピ保存・読み込み機能

---

### Phase 3: MVP - レシピ基本機能（3-4日）
- レシピ一覧表示（RecipeList）
- レシピ詳細表示（RecipeDetail）
- レシピ手動入力フォーム（RecipeForm）
- レシピ削除機能
- 基本的な手帳風デザイン適用

**成果物**: 手動でレシピを追加・閲覧・削除できるアプリ

---

### Phase 4: 画像機能（2-3日）
- 画像アップロード機能
- 画像圧縮（browser-image-compression）
- Blob形式でIndexedDBに保存
- 画像プレビュー表示
- 画像削除機能

**成果物**: 画像付きレシピ管理

---

### Phase 5: 検索・フィルター（2日）
- 料理名検索機能（SearchBar）
- 材料検索機能
- 作成日でのソート
- 検索結果のハイライト表示

**成果物**: レシピを素早く見つけられる検索機能

---

### Phase 6: 候補画像グリッド表示（2-3日）
- 候補画像の3列グリッド表示
- 画像選択UI
- 選択画像のプレビュー
- 「記録する」「除外する」ボタン

**成果物**: メイン体験の候補選択フロー

---

### Phase 7: 画像解析統合（3-4日）
- Claude Vision API統合
- 画像からテキスト抽出
- 料理名・材料・手順の自動認識
- ユーザー修正UI
- エラーハンドリング

**成果物**: 画像から自動でレシピ情報を抽出

---

### Phase 8: デザイン仕上げ・PWA化（2-3日）
- 手帳風デザインの細部調整
- レスポンシブ対応
- PWA設定（オフライン対応）
- アクセシビリティ対応
- ローディング状態・エラー表示改善

**成果物**: プロダクション品質のアプリ

---

### Phase 9: テスト・デプロイ（2日）
- 主要コンポーネントのテスト作成
- E2Eテスト（余裕があれば）
- パフォーマンス最適化
- Netlifyデプロイ
- ドキュメント整備

**成果物**: デプロイ済み、テスト済みアプリ

---

## 📝 詳細実装計画

### Phase 1: プロジェクトセットアップ

#### タスク1: Viteプロジェクト作成
```bash
npm create vite@latest recipe-app -- --template react-ts
cd recipe-app
npm install
```

#### タスク2: 依存関係インストール
```bash
# コア依存関係
npm install react-router-dom zustand dexie dexie-react-hooks browser-image-compression

# Tailwind CSS + daisyUI
npm install -D tailwindcss postcss autoprefixer daisyui
npx tailwindcss init -p

# 開発ツール
npm install -D eslint @eslint/js typescript-eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-jsx-a11y

# テスト
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# PWA
npm install -D vite-plugin-pwa
```

#### タスク3: 設定ファイル作成

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: '料理日記・レシピ手帳',
        short_name: 'レシピ手帳',
        description: 'オフラインで使える料理レシピ管理アプリ',
        theme_color: '#D4A574',
        background_color: '#F9F6F0',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          store: ['zustand'],
          db: ['dexie']
        }
      }
    }
  }
})
```

**tailwind.config.js:**
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
        paper: '#F9F6F0',      // ノート背景色
        ink: '#2C2C2C',        // テキスト色
        accent: '#D4A574',     // アクセントカラー（ゴールド）
        cream: '#FFF9E6',      // クリーム色
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
    themes: ["cupcake"], // 手帳風に適した柔らかいテーマ
  },
}
```

**tsconfig.json:**
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
    "exactOptionalPropertyTypes": false,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
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
    },

    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**eslint.config.js:**
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
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error'
    }
  }
]
```

**prettier.config.js:**
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

**.env.example:**
```bash
# Claudeのウェブアプリのユーザー設定でAPI Keyが作成できます
# https://console.anthropic.com/settings/keys
VITE_CLAUDE_API_KEY=your_api_key_here
VITE_APP_TITLE=料理日記・レシピ手帳
```

**package.json (scripts追加):**
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
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  }
}
```

#### タスク4: ディレクトリ構造作成
```bash
mkdir -p src/{features/{recipes,search,imageAnalysis}/{components,hooks,services,types},shared/{components,hooks,utils,types},store,db,routes,assets/{fonts,images},styles}
```

#### タスク5: Git初期化
```bash
git init
git add .
git commit -m "chore: プロジェクト初期セットアップ"
```

---

### Phase 2: データ基盤構築

#### タスク1: 型定義作成

**src/features/recipes/types/recipe.types.ts:**
```typescript
export interface Ingredient {
  name: string
  amount: string
}

export interface Recipe {
  id?: number
  title: string
  servings?: string
  ingredients: Ingredient[]
  steps: string[]
  imageBlob?: Blob
  thumbnailBlob?: Blob
  memo?: string
  createdAt: Date
  updatedAt: Date
  category?: string
  tags?: string[]
}

export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>

export interface RecipeSearchParams {
  query?: string
  category?: string
  tags?: string[]
  sortBy?: 'createdAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}
```

#### タスク2: Dexie.jsデータベース定義

**src/db/recipeDb.ts:**
```typescript
import Dexie, { Table } from 'dexie'
import { Recipe } from '@/features/recipes/types/recipe.types'

export class RecipeDatabase extends Dexie {
  recipes!: Table<Recipe>

  constructor() {
    super('RecipeDatabase')

    this.version(1).stores({
      recipes: '++id, title, category, createdAt, *tags'
    })
  }
}

export const db = new RecipeDatabase()
```

#### タスク3: Recipe Service作成

**src/features/recipes/services/recipeService.ts:**
```typescript
import { db } from '@/db/recipeDb'
import { Recipe, RecipeFormData } from '../types/recipe.types'

export const recipeService = {
  async getAll(): Promise<Recipe[]> {
    return await db.recipes.orderBy('createdAt').reverse().toArray()
  },

  async getById(id: number): Promise<Recipe | undefined> {
    return await db.recipes.get(id)
  },

  async create(recipeData: RecipeFormData): Promise<number> {
    const recipe: Recipe = {
      ...recipeData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return await db.recipes.add(recipe)
  },

  async update(id: number, recipeData: Partial<Recipe>): Promise<void> {
    await db.recipes.update(id, {
      ...recipeData,
      updatedAt: new Date()
    })
  },

  async delete(id: number): Promise<void> {
    await db.recipes.delete(id)
  },

  async search(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase()
    const recipes = await db.recipes.toArray()

    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery))
    )
  }
}
```

#### タスク4: Zustand Store作成

**src/store/recipeStore.ts:**
```typescript
import { create } from 'zustand'
import { Recipe } from '@/features/recipes/types/recipe.types'

interface RecipeStore {
  recipes: Recipe[]
  selectedRecipeId: number | null
  isLoading: boolean
  error: string | null

  setRecipes: (recipes: Recipe[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: number, recipe: Partial<Recipe>) => void
  deleteRecipe: (id: number) => void
  setSelectedRecipeId: (id: number | null) => void
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

#### タスク5: カスタムフック作成

**src/features/recipes/hooks/useRecipes.ts:**
```typescript
import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/recipeDb'
import { recipeService } from '../services/recipeService'
import { useRecipeStore } from '@/store/recipeStore'

export function useRecipes() {
  const recipes = useLiveQuery(() => recipeService.getAll())
  const { setRecipes, setLoading, setError } = useRecipeStore()

  useEffect(() => {
    if (recipes) {
      setRecipes(recipes)
      setLoading(false)
    }
  }, [recipes, setRecipes, setLoading])

  return {
    recipes: recipes ?? [],
    createRecipe: recipeService.create,
    updateRecipe: recipeService.update,
    deleteRecipe: recipeService.delete,
    searchRecipes: recipeService.search
  }
}
```

---

### Phase 3: MVP - レシピ基本機能

#### タスク1: 共通コンポーネント作成

**src/shared/components/Button.tsx:**
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

**src/shared/components/LoadingSpinner.tsx:**
```typescript
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <span className="loading loading-spinner loading-lg text-accent"></span>
    </div>
  )
}
```

#### タスク2: レシピカード

**src/features/recipes/components/RecipeCard.tsx:**
```typescript
import { Recipe } from '../types/recipe.types'
import { useMemo } from 'react'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const imageUrl = useMemo(() => {
    if (recipe.thumbnailBlob) {
      return URL.createObjectURL(recipe.thumbnailBlob)
    }
    return null
  }, [recipe.thumbnailBlob])

  return (
    <div
      className="card bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-accent/20"
      onClick={onClick}
    >
      {imageUrl && (
        <figure className="px-4 pt-4">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="rounded-lg h-48 w-full object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <h3 className="card-title font-handwriting text-ink">{recipe.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
        </p>
        {recipe.memo && (
          <p className="text-sm text-gray-700 line-clamp-2">{recipe.memo}</p>
        )}
      </div>
    </div>
  )
}
```

#### タスク3: レシピ一覧

**src/features/recipes/components/RecipeList.tsx:**
```typescript
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { RecipeCard } from './RecipeCard'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'

export function RecipeList() {
  const { recipes } = useRecipes()
  const navigate = useNavigate()

  if (!recipes) {
    return <LoadingSpinner />
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 mb-4">まだレシピがありません</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/recipes/new')}
        >
          最初のレシピを追加
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => navigate(`/recipes/${recipe.id}`)}
        />
      ))}
    </div>
  )
}
```

#### タスク4: レシピフォーム

**src/features/recipes/components/RecipeForm.tsx:**
```typescript
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { Ingredient } from '../types/recipe.types'
import { Button } from '@/shared/components/Button'

export function RecipeForm() {
  const navigate = useNavigate()
  const { createRecipe } = useRecipes()

  const [title, setTitle] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
  const [steps, setSteps] = useState<string[]>([''])
  const [memo, setMemo] = useState('')

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }])
  }

  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index]![field] = value
    setIngredients(newIngredients)
  }

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const recipeData = {
      title,
      servings,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      steps: steps.filter(step => step.trim() !== ''),
      memo
    }

    try {
      await createRecipe(recipeData)
      navigate('/')
    } catch (error) {
      console.error('レシピの保存に失敗しました:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg border-2 border-accent/20 p-8">
        <h1 className="text-3xl font-handwriting text-ink mb-6">新しいレシピ</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 料理名 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">料理名</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* 分量 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">分量（例: 2人分）</span>
            </label>
            <input
              type="text"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* 材料 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">材料</span>
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="材料名"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  className="input input-bordered flex-1"
                />
                <input
                  type="text"
                  placeholder="分量"
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                  className="input input-bordered w-32"
                />
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={handleAddIngredient}>
              材料を追加
            </Button>
          </div>

          {/* 手順 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">手順</span>
            </label>
            {steps.map((step, index) => (
              <div key={index} className="mb-2">
                <textarea
                  placeholder={`手順 ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows={2}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={handleAddStep}>
              手順を追加
            </Button>
          </div>

          {/* メモ */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">メモ（任意）</span>
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="次回は塩少なめで、など"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <Button type="submit" variant="primary">保存する</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

#### タスク5: ルーティング設定

**src/routes/index.tsx:**
```typescript
import { createBrowserRouter } from 'react-router-dom'
import { RecipeList } from '@/features/recipes/components/RecipeList'
import { RecipeForm } from '@/features/recipes/components/RecipeForm'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'

const RecipeDetail = lazy(() => import('@/features/recipes/components/RecipeDetail').then(m => ({ default: m.RecipeDetail })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipeList />
  },
  {
    path: '/recipes/new',
    element: <RecipeForm />
  },
  {
    path: '/recipes/:id',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RecipeDetail />
      </Suspense>
    )
  }
])
```

**src/App.tsx:**
```typescript
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
```

---

### Phase 4〜9の詳細実装計画

（Phase 4以降の詳細は各Phaseで実装時に展開します。基本的な流れは上記と同様に、型定義 → サービス → コンポーネント → 統合の順で進めます）

**Phase 4のポイント:**
- `browser-image-compression`で画像圧縮
- サムネイル生成（300px）
- Blob形式でIndexedDB保存

**Phase 5のポイント:**
- Dexie.jsのクエリ機能活用
- デバウンス処理（useDebounce hook作成）
- 検索結果のハイライト表示

**Phase 6のポイント:**
- CSS Gridで3列レイアウト
- 画像選択状態の管理
- モーダルでのプレビュー表示

**Phase 7のポイント:**
- Claude Vision API統合
- エラーハンドリング（API制限、ネットワークエラー等）
- ローディング状態表示

**Phase 8のポイント:**
- ノートバインダー風装飾
- レスポンシブ対応（スマホ・タブレット）
- アクセシビリティ（ARIA属性、キーボードナビゲーション）

---

## 📊 データ設計

### IndexedDBスキーマ

**Version 1:**
```typescript
{
  recipes: '++id, title, category, createdAt, *tags'
}
```

**インデックス説明:**
- `++id`: 自動インクリメントのプライマリキー
- `title`: 料理名（検索用）
- `category`: カテゴリ（フィルター用）
- `createdAt`: 作成日時（ソート用）
- `*tags`: マルチエントリーインデックス（複数タグ検索）

### データフロー

```
ユーザー入力
  ↓
RecipeForm (バリデーション)
  ↓
recipeService.create() (ビジネスロジック)
  ↓
IndexedDB (永続化)
  ↓
Dexie useLiveQuery (自動リアクティブ)
  ↓
Zustand Store (状態同期)
  ↓
React Components (UI更新)
```

---

## 🚀 デプロイ・運用

### Netlifyデプロイ手順

1. **Netlify CLI インストール**
```bash
npm install -g netlify-cli
```

2. **ビルド**
```bash
npm run build
```

3. **デプロイ**
```bash
netlify deploy --prod
```

### netlify.toml設定

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 環境変数設定（Netlify）

Netlify管理画面 → Site settings → Environment variables:
```
VITE_CLAUDE_API_KEY=sk-ant-api03-...
```

---

## ✅ 開発チェックリスト

### Phase 1: セットアップ
- [ ] Viteプロジェクト作成
- [ ] 依存関係インストール
- [ ] Tailwind CSS設定
- [ ] ESLint/Prettier設定
- [ ] ディレクトリ構造作成
- [ ] Git初期化

### Phase 2: データ基盤
- [ ] 型定義作成
- [ ] Dexie.jsデータベース定義
- [ ] Recipe Service実装
- [ ] Zustand Store作成
- [ ] useRecipes Hook作成

### Phase 3: MVP
- [ ] 共通コンポーネント（Button, LoadingSpinner）
- [ ] RecipeCard実装
- [ ] RecipeList実装
- [ ] RecipeForm実装
- [ ] RecipeDetail実装
- [ ] ルーティング設定

### Phase 4: 画像機能
- [ ] 画像アップロードUI
- [ ] 画像圧縮実装
- [ ] サムネイル生成
- [ ] IndexedDBへのBlob保存
- [ ] 画像プレビュー表示

### Phase 5: 検索
- [ ] SearchBar実装
- [ ] useDebounce Hook
- [ ] 料理名検索
- [ ] 材料検索
- [ ] 検索結果ハイライト

### Phase 6: 候補グリッド
- [ ] 3列グリッドレイアウト
- [ ] 画像選択UI
- [ ] 選択状態管理
- [ ] プレビューモーダル

### Phase 7: 画像解析
- [ ] Claude Vision API統合
- [ ] テキスト抽出処理
- [ ] エラーハンドリング
- [ ] ユーザー修正UI

### Phase 8: デザイン仕上げ
- [ ] 手帳風デザイン適用
- [ ] レスポンシブ対応
- [ ] PWA設定
- [ ] アクセシビリティ対応

### Phase 9: テスト・デプロイ
- [ ] コンポーネントテスト
- [ ] パフォーマンス最適化
- [ ] Netlifyデプロイ
- [ ] README作成

---

## 📚 参考資料

### 公式ドキュメント
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [Dexie.js](https://dexie.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)

### ベストプラクティス
- [React Best Practices 2025](https://react.dev/learn)
- [TypeScript Best Practices](https://typescript-eslint.io/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

## 🎯 成功指標

### 開発完了の定義
- ✅ すべてのPhaseのタスクが完了
- ✅ 主要機能のテストが通る
- ✅ Lighthouse スコア: Performance 90+, Accessibility 90+
- ✅ Netlifyにデプロイ済み
- ✅ 個人で実際に使える状態

### 品質基準
- TypeScript エラー 0件
- ESLint エラー 0件
- コンソールエラー 0件
- レスポンシブ対応（モバイル・タブレット・デスクトップ）
- オフライン動作確認済み

---

**作成日**: 2025-11-12
**最終更新**: 2025-11-12
**バージョン**: 1.0.0
