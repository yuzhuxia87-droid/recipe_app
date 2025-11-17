import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Recipe } from '../types/recipe.types'
import { Button } from '@/shared/components/Button'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { useRecipes } from '../hooks/useRecipes'

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { deleteRecipe, getRecipeById } = useRecipes()
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
        const data = await getRecipeById(id)
        if (!data) {
          toast.error('レシピが見つかりませんでした')
          navigate('/')
          return
        }
        setRecipe(data)
      } catch (error) {
        console.error('レシピ取得エラー:', error)
        toast.error('レシピの取得に失敗しました')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [id, navigate, getRecipeById])

  const handleDelete = async () => {
    if (!recipe) return

    if (!confirm(`「${recipe.title}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteRecipe(recipe.id)
      toast.success('レシピを削除しました')
      navigate('/')
    } catch (err) {
      console.error('レシピ削除エラー:', err)
      toast.error('レシピの削除に失敗しました')
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
    <div className="min-h-screen bg-notebook-page-white bg-grid-paper bg-grid bg-opacity-15 relative">
      <div className="max-w-2xl mx-auto">
        {/* ナビゲーションヘッダー */}
        <div className="pt-12 pb-10 px-6">
          <div className="flex justify-between items-center">
            {/* 左: 戻るボタン */}
            <button
              className="text-notebook-ink hover:text-notebook-accent font-handwriting text-sm transition-colors"
              onClick={() => navigate('/')}
            >
              ← 戻る
            </button>

            {/* 右: 編集ボタン */}
            <Button
              variant="secondary"
              size="sm"
              className="min-h-[44px] px-5"
              onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
            >
              編集
            </Button>
          </div>
        </div>

        {/* カード積み重ね型レイアウト */}
        <div className="px-6 pb-8 space-y-6">
          {/* 情報カード */}
          <div className="bg-notebook-card rounded-card shadow-card p-6 relative">
            <h2 className="text-note-2xl font-handwriting text-notebook-ink mb-4 leading-relaxed">
              {recipe.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-notebook-ink-light font-handwriting">
              <span>
                {new Date(recipe.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {recipe.servings && <span>分量: {recipe.servings}</span>}
            </div>
            {/* タグ */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-notebook-accent-light text-notebook-ink font-handwriting"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 画像カード */}
          {(recipe.illustrated_url || recipe.image_url) && (
            <div className="bg-notebook-card rounded-card shadow-card p-4">
              <img
                src={recipe.illustrated_url || recipe.image_url || ''}
                alt={recipe.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* 材料カード */}
          <div className="bg-notebook-card rounded-card shadow-card p-6">
            <h2 className="text-note-xl font-handwriting text-notebook-ink mb-4 pb-2 border-b-2 border-notebook-border">
              材料
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-notebook-border/30 last:border-0"
                >
                  <span className="font-sans text-notebook-ink">{ingredient.name}</span>
                  <span className="font-handwriting text-notebook-ink font-semibold">{ingredient.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 手順カード */}
          <div className="bg-notebook-card rounded-card shadow-card p-6">
            <h2 className="text-note-xl font-handwriting text-notebook-ink mb-4 pb-2 border-b-2 border-notebook-border">
              手順
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 border-2 border-notebook-accent text-notebook-accent rounded-full flex items-center justify-center font-handwriting font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1 font-sans text-notebook-ink leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* メモカード */}
          {recipe.memo && (
            <div className="bg-notebook-card rounded-card shadow-card p-6">
              <h2 className="text-note-xl font-handwriting text-notebook-ink mb-4 pb-2 border-b-2 border-notebook-border">
                メモ
              </h2>
              <p className="font-handwriting text-notebook-ink leading-relaxed whitespace-pre-wrap">
                {recipe.memo}
              </p>
            </div>
          )}

          {/* 削除ボタン */}
          <div className="pt-4">
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="w-full">
              {isDeleting ? '削除中...' : 'このレシピを削除'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
