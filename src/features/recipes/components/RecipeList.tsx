import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useRecipeStore } from '@/store/recipeStore'
import { RecipeCard } from './RecipeCard'
import { SearchBar } from './SearchBar'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { HandDrawnUnderline } from '@/shared/components/notebook/HandDrawnUnderline'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/shared/components/Select'
import { sortRecipes } from '../utils/recipeSort'

export function RecipeList() {
  const { recipes, allRecipes, searchQuery, searchRecipes, clearSearch, toggleFavorite } = useRecipes()
  const { isLoading, sortOrder, setSortOrder } = useRecipeStore()
  const navigate = useNavigate()

  // レシピを並び替え
  const sortedRecipes = useMemo(() => {
    return sortRecipes(recipes, sortOrder)
  }, [recipes, sortOrder])

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

        {/* ツールバー（検索 + 並び替え） */}
        <div className="mb-8 px-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
            {/* 検索バー */}
            <div className="w-full sm:flex-1">
              <SearchBar onSearch={searchRecipes} onClear={clearSearch} />
            </div>

            {/* 並び替えドロップダウン */}
            <div className="w-full sm:w-auto">
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as typeof sortOrder)}
              >
                <SelectTrigger className="h-10 w-full sm:w-[160px]">
                  並び替え
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">新しい順</SelectItem>
                  <SelectItem value="oldest">古い順</SelectItem>
                  <SelectItem value="name">名前順</SelectItem>
                  <SelectItem value="favorites-first">お気に入り優先</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

        {/* レシピグリッド（モバイル2カラム Pinterest風） */}
        {!isLoading && sortedRecipes.length > 0 && (
          <div className="px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-card-gap md:gap-card-gap-md items-start">
              {sortedRecipes.map((recipe) => (
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
