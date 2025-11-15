import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useRecipeStore } from '@/store/recipeStore'
import { RecipeCard } from './RecipeCard'
import { SearchBar } from './SearchBar'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { HandDrawnUnderline } from '@/shared/components/notebook/HandDrawnUnderline'

type TabType = 'all' | 'favorites'

export function RecipeList() {
  const { recipes, allRecipes, searchQuery, searchRecipes, clearSearch } = useRecipes()
  const { isLoading, toggleFavorite } = useRecipeStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('all')

  // タブに応じてレシピをフィルタリング
  const displayedRecipes = activeTab === 'favorites'
    ? recipes.filter(recipe => recipe.favorite)
    : recipes

  // レシピが本当に0件の場合（初期状態）
  if (allRecipes.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-notebook-page-white bg-grid-paper bg-grid bg-opacity-15 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-handwriting text-notebook-ink mb-4">まだレシピがありません</h2>
          <p className="text-notebook-ink-light mb-8 font-handwriting leading-relaxed">
            最初のレシピを追加して、料理日記を始めましょう！
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notebook-page-white bg-grid-paper bg-grid bg-opacity-15 relative">
      <div className="max-w-7xl mx-auto">
        {/* ページヘッダー（ノートに書き込まれたタイトル） */}
        <div className="pt-12 pb-8 px-6">
          <h1 className="text-note-2xl md:text-note-3xl font-handwriting font-medium text-notebook-ink text-center mb-3">
            My Kitchen Diary
          </h1>

          <div className="flex justify-center mb-2">
            <HandDrawnUnderline width="lg" color="#5C5446" />
          </div>

          <p className="text-note-xs text-notebook-ink-light text-center font-handwriting opacity-70">
            personal cooking notes
          </p>
        </div>

        {/* 検索バー */}
        <div className="mb-6 px-6">
          <SearchBar onSearch={searchRecipes} onClear={clearSearch} />
        </div>

        {/* タブ切り替え */}
        <div className="mb-8 px-6">
          <div className="flex gap-2 border-b-2 border-notebook-border">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                px-4 py-2 font-handwriting text-note-base transition-colors relative
                ${activeTab === 'all'
                  ? 'text-notebook-ink font-medium'
                  : 'text-notebook-ink-light hover:text-notebook-ink'
                }
              `}
            >
              すべて
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-notebook-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`
                px-4 py-2 font-handwriting text-note-base transition-colors relative flex items-center gap-1
                ${activeTab === 'favorites'
                  ? 'text-notebook-ink font-medium'
                  : 'text-notebook-ink-light hover:text-notebook-ink'
                }
              `}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.045 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001z" />
              </svg>
              お気に入り
              {activeTab === 'favorites' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-notebook-accent" />
              )}
            </button>
          </div>
        </div>

        {/* ローディング中 */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        )}

        {/* 検索結果が0件の場合（ローディング完了後のみ） */}
        {!isLoading && searchQuery && recipes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl font-handwriting text-notebook-ink mb-2">
              検索結果が見つかりませんでした
            </p>
            <p className="text-notebook-ink-light font-handwriting">別のキーワードで検索してみてください</p>
          </div>
        )}

        {/* お気に入りが0件の場合 */}
        {!isLoading && activeTab === 'favorites' && displayedRecipes.length === 0 && !searchQuery && (
          <div className="text-center py-16">
            <p className="text-2xl font-handwriting text-notebook-ink mb-2">
              お気に入りがまだありません
            </p>
            <p className="text-notebook-ink-light font-handwriting">ハートマークをクリックしてお気に入りを追加しましょう</p>
          </div>
        )}

        {/* レシピグリッド（モバイル2カラム Pinterest風） */}
        {!isLoading && displayedRecipes.length > 0 && (
          <div className="px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-card-gap md:gap-card-gap-md items-start">
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* フローティングボタン（新規レシピ追加） */}
        <button
          onClick={() => navigate('/recipes/new')}
          className="
            fixed bottom-8 right-6
            w-16 h-16
            rounded-full
            bg-notebook-accent
            text-white
            shadow-fab
            hover:shadow-xl
            hover:scale-110
            transition-all duration-300
            border-2 border-white
            rotate-3
            hover:rotate-0
            flex items-center justify-center
            z-fab
          "
          aria-label="新しいレシピを追加"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
