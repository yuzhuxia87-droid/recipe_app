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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }])
  }

  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const newIngredients = [...ingredients]
    const ingredient = newIngredients[index]
    if (ingredient) {
      ingredient[field] = value
      setIngredients(newIngredients)
    }
  }

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('料理名を入力してください')
      return
    }

    const recipeData = {
      title: title.trim(),
      servings: servings.trim() || null,
      ingredients: ingredients.filter((ing) => ing.name.trim() !== ''),
      steps: steps.filter((step) => step.trim() !== ''),
      memo: memo.trim() || null,
    }

    if (recipeData.ingredients.length === 0) {
      alert('材料を少なくとも1つ入力してください')
      return
    }

    if (recipeData.steps.length === 0) {
      alert('手順を少なくとも1つ入力してください')
      return
    }

    try {
      setIsSubmitting(true)
      await createRecipe(recipeData)
      navigate('/')
    } catch (error) {
      alert('レシピの保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg border-2 border-accent/20 p-8">
          <h1 className="text-3xl font-handwriting text-ink mb-6">新しいレシピ</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 料理名 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">
                  料理名 <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                placeholder="例: カレーライス"
                required
              />
            </div>

            {/* 分量 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">分量</span>
              </label>
              <input
                type="text"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="input input-bordered w-full"
                placeholder="例: 2人分"
              />
            </div>

            {/* 材料 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">
                  材料 <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
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
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleAddIngredient}>
                  材料を追加
                </Button>
              </div>
            </div>

            {/* 手順 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">
                  手順 <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-12 bg-accent/20 rounded font-bold text-ink">
                      {index + 1}
                    </div>
                    <textarea
                      placeholder={`手順 ${index + 1}`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="textarea textarea-bordered flex-1"
                      rows={2}
                    />
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveStep(index)}
                      >
                        削除
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleAddStep}>
                  手順を追加
                </Button>
              </div>
            </div>

            {/* メモ */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base">メモ（任意）</span>
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="次回は塩少なめで、子供には辛すぎた、など"
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存する'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
