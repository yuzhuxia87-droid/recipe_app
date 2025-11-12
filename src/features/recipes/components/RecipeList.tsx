import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useRecipeStore } from '@/store/recipeStore'
import { RecipeCard } from './RecipeCard'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/Button'

export function RecipeList() {
  const { recipes } = useRecipes()
  const { isLoading } = useRecipeStore()
  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-handwriting text-ink mb-4">
            まだレシピがありません
          </h2>
          <p className="text-gray-600 mb-8">
            最初のレシピを追加して、料理日記を始めましょう！
          </p>
          <Button size="lg" onClick={() => navigate('/recipes/new')}>
            最初のレシピを追加
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-handwriting text-ink">料理日記・レシピ手帳</h1>
          <Button onClick={() => navigate('/recipes/new')}>新しいレシピ</Button>
        </div>

        {/* レシピグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
