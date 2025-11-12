import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeService } from '../services/recipeService'
import { Recipe } from '../types/recipe.types'
import { Button } from '@/shared/components/Button'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { useRecipes } from '../hooks/useRecipes'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { deleteRecipe } = useRecipes()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const loadRecipe = async () => {
      try {
        setIsLoading(true)
        const data = await recipeService.getById(id)
        if (!data) {
          alert('レシピが見つかりませんでした')
          navigate('/')
          return
        }
        setRecipe(data)
      } catch (error) {
        console.error('レシピ取得エラー:', error)
        alert('レシピの取得に失敗しました')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!recipe) return

    if (!confirm(`「${recipe.title}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteRecipe(recipe.id)
      navigate('/')
    } catch (error) {
      alert('レシピの削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* 戻るボタン */}
        <div className="mb-4">
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← 一覧に戻る
          </Button>
        </div>

        {/* レシピカード */}
        <div className="bg-white shadow-lg rounded-lg border-2 border-accent/20 p-8">
          {/* タイトル */}
          <h1 className="text-4xl font-handwriting text-ink mb-4">{recipe.title}</h1>

          {/* メタ情報 */}
          <div className="flex gap-4 text-sm text-gray-600 mb-6">
            <span>
              作成日:{' '}
              {new Date(recipe.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {recipe.servings && <span>分量: {recipe.servings}</span>}
          </div>

          {/* 画像 */}
          {recipe.image_url && (
            <div className="mb-6">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-auto rounded-lg border-2 border-accent/20"
              />
            </div>
          )}

          {/* タグ */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="badge badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 材料 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4 border-b-2 border-accent/30 pb-2">
              材料
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex justify-between py-2 border-b border-gray-200">
                  <span>{ingredient.name}</span>
                  <span className="font-semibold">{ingredient.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 手順 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink mb-4 border-b-2 border-accent/30 pb-2">
              手順
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* メモ */}
          {recipe.memo && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-ink mb-4 border-b-2 border-accent/30 pb-2">
                メモ
              </h2>
              <div className="bg-cream p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{recipe.memo}</p>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '削除中...' : '削除'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
