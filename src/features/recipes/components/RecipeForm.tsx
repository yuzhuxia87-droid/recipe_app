import { useState, FormEvent, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Bot, X } from 'lucide-react'
import { useRecipes } from '../hooks/useRecipes'
import { Ingredient } from '../types/recipe.types'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/Accordion'
import { ImageUpload } from './ImageUpload'
import { RecipeScreenshotUpload } from './RecipeScreenshotUpload'
import { imageService } from '../services/imageService'
import { visionService } from '../services/visionService'
import { unsplashService } from '../services/unsplashService'
import { illustrationService } from '../services/illustrationService'

export function RecipeForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { createRecipe, updateRecipe, getRecipeById } = useRecipes()

  // 編集モード判定
  const isEditMode = !!id

  // レシピ情報セクションへの参照
  const recipeFormSectionRef = useRef<HTMLDivElement>(null)

  // フォームデータ
  const [title, setTitle] = useState('')
  const [displayTitle, setDisplayTitle] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
  const [steps, setSteps] = useState<string[]>([''])
  const [memo, setMemo] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  // AI抽出用
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)

  // 編集モード: 既存レシピをロード
  useEffect(() => {
    if (!isEditMode || !id) return

    const loadRecipe = async () => {
      try {
        setIsLoadingRecipe(true)
        const recipe = await getRecipeById(id)

        if (!recipe) {
          toast.error('レシピが見つかりませんでした')
          navigate('/')
          return
        }

        // フォームに既存データを設定
        setTitle(recipe.title)
        setDisplayTitle(recipe.displayTitle || '')
        setServings(recipe.servings || '')
        setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '' }])
        setSteps(recipe.steps.length > 0 ? recipe.steps : [''])
        setMemo(recipe.memo || '')

        // 既存画像URLを設定
        setCurrentImageUrl(recipe.illustrated_url || recipe.image_url || null)
      } catch (error) {
        console.error('レシピ読み込みエラー:', error)
        toast.error('レシピの読み込みに失敗しました')
        navigate('/')
      } finally {
        setIsLoadingRecipe(false)
      }
    }

    loadRecipe()
  }, [isEditMode, id, getRecipeById, navigate])

  // 材料の操作
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

  // 手順の操作
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

  // 短縮タイトルを自動生成
  const handleGenerateDisplayTitle = async () => {
    if (!title.trim()) {
      toast.error('料理名を入力してください')
      return
    }

    try {
      setIsGeneratingTitle(true)
      const generated = await visionService.generateDisplayTitle(title)
      setDisplayTitle(generated)
      toast.success('短縮タイトルを生成しました')
    } catch (error) {
      console.error('短縮タイトル生成エラー:', error)
      toast.error('短縮タイトルの生成に失敗しました')
    } finally {
      setIsGeneratingTitle(false)
    }
  }

  // AI抽出実行
  const handleExtractRecipe = async () => {
    if (screenshots.length === 0) {
      toast.error('スクリーンショットを選択してください')
      return
    }

    try {
      setIsExtracting(true)

      // Vision APIでレシピ情報を抽出
      const extracted = await visionService.extractRecipeFromImages(screenshots)

      // フォームに自動入力
      setTitle(extracted.title)
      setServings(extracted.servings || '')
      setIngredients(extracted.ingredients)
      setSteps(extracted.steps)
      setMemo(extracted.memo || '')

      // 短縮タイトルを自動生成
      try {
        const generated = await visionService.generateDisplayTitle(extracted.title)
        setDisplayTitle(generated)
      } catch (error) {
        console.error('短縮タイトル生成エラー:', error)
        // エラーでも続行（短縮タイトルは任意のため）
      }

      toast.success('レシピ情報を抽出しました！')

      // レシピ情報セクションにスクロール
      setTimeout(() => {
        recipeFormSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 300)

      // 料理写真の処理：常にUnsplashから取得してイラスト風に変換
      toast('料理写真を検索しています...', { icon: '🔍' })

      try {
        // 英語の料理名で検索（精度向上のため）
        const searchQuery = extracted.dishNameEnglish || extracted.dishName || extracted.title
        console.log('🔍 Unsplash検索:', {
          title: extracted.title,
          dishName: extracted.dishName,
          dishNameEnglish: extracted.dishNameEnglish,
          searchQuery
        })

        const imageUrl = await unsplashService.getFoodImage(searchQuery)

        if (imageUrl) {
          console.log('📸 Unsplash画像取得成功:', imageUrl)

          // URLからFileオブジェクトに変換
          const imageFile = await unsplashService.urlToFile(
            imageUrl,
            `${extracted.dishName}_original.jpg`
          )
          console.log('📦 Fileオブジェクト変換完了:', imageFile.name, imageFile.size)

          // イラスト風に変換（強度3: 強め）
          console.log('🎨 イラスト風変換開始...')
          const illustratedFile = await illustrationService.convertToIllustration(imageFile, 3)
          console.log('✨ イラスト風変換完了:', illustratedFile.name, illustratedFile.size)

          setSelectedImage(illustratedFile)

          toast.success('料理写真を取得しました')
        } else {
          console.warn('⚠️ Unsplash画像が見つかりませんでした')
          toast('料理写真が見つかりませんでした。後で手動で追加できます。', { icon: 'ℹ️' })
        }
      } catch (imageError) {
        console.error('❌ 画像取得エラー:', imageError)
        toast('料理写真の取得に失敗しました。後で手動で追加できます。', { icon: 'ℹ️' })
      }
    } catch (error) {
      console.error('レシピ抽出エラー:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('レシピの抽出に失敗しました')
      }
    } finally {
      setIsExtracting(false)
    }
  }

  // レシピ保存
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('料理名を入力してください')
      return
    }

    const filteredIngredients = ingredients.filter(ing => ing.name.trim() !== '')
    const filteredSteps = steps.filter(step => step.trim() !== '')

    if (filteredIngredients.length === 0) {
      toast.error('材料を少なくとも1つ入力してください')
      return
    }

    if (filteredSteps.length === 0) {
      toast.error('手順を少なくとも1つ入力してください')
      return
    }

    try {
      setIsSubmitting(true)

      let imageUrl: string | undefined
      let thumbnailUrl: string | undefined
      let illustratedUrl: string | undefined

      // 画像処理
      if (selectedImage) {
        // 新しい画像が選択された場合はアップロード
        try {
          const urls = await imageService.uploadImageWithThumbnail(selectedImage)
          imageUrl = urls.imageUrl
          thumbnailUrl = urls.thumbnailUrl

          // イラスト風画像として扱う
          illustratedUrl = urls.imageUrl
        } catch (uploadError) {
          console.error('画像アップロードエラー:', uploadError)
          throw new Error(`画像アップロード失敗: ${uploadError}`)
        }
      } else if (isEditMode && currentImageUrl) {
        // 編集モードで画像を変更していない場合は既存URLを保持
        illustratedUrl = currentImageUrl
        imageUrl = currentImageUrl
        // thumbnailUrlは元のレシピから取得する必要があるため、後で対応
      }

      const recipeData = {
        title: title.trim(),
        displayTitle: displayTitle.trim() || null,
        servings: servings.trim() || null,
        ingredients: filteredIngredients,
        steps: filteredSteps,
        memo: memo.trim() || null,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        illustrated_url: illustratedUrl,
      }

      if (isEditMode && id) {
        // 編集モード: 更新
        await updateRecipe(id, recipeData)
        toast.success('レシピを更新しました')
        navigate(`/recipes/${id}`)
      } else {
        // 新規作成モード
        await createRecipe(recipeData)
        toast.success('レシピを保存しました')
        navigate('/')
      }
    } catch (error) {
      console.error('レシピ保存エラー:', error)
      toast.error('レシピの保存に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ローディング中の表示
  if (isLoadingRecipe) {
    return (
      <div className="min-h-screen bg-notebook-page-white bg-grid-paper bg-grid bg-opacity-15 flex items-center justify-center">
        <div className="text-notebook-ink font-handwriting text-note-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-notebook-page-white bg-grid-paper bg-grid bg-opacity-15 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ページカード */}
        <div className="bg-notebook-white rounded-card shadow-card p-6 md:p-8 relative">
          <Accordion
            type="multiple"
            defaultValue={isEditMode ? ["form"] : ["ai", "form"]}
            className="space-y-4"
          >
            {/* AI抽出セクション（新規作成時のみ表示） */}
            {!isEditMode && (
              <AccordionItem value="ai" className="bg-notebook-card rounded-card shadow-card border-0">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-notebook-accent" />
                    <span>AIでレシピを抽出</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <div className="mb-6">
                    <p className="text-note-sm text-notebook-ink-light font-handwriting leading-relaxed">
                      Instagramやクックパッドなどのレシピスクショをアップロードすると、AIが自動でレシピ情報を抽出します
                    </p>
                  </div>

                  <RecipeScreenshotUpload onImagesSelected={setScreenshots} disabled={isExtracting} />

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleExtractRecipe}
                    disabled={screenshots.length === 0 || isExtracting}
                    className="w-full mt-6"
                  >
                    {isExtracting ? 'AI抽出中...' : 'AIでレシピを抽出'}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* レシピ情報フォーム */}
            <AccordionItem value="form" ref={recipeFormSectionRef} className="bg-notebook-card rounded-card shadow-card border-0">
              <AccordionTrigger className="px-6 py-4">
                レシピ情報
              </AccordionTrigger>
              <AccordionContent className="px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 画像アップロード */}
              <ImageUpload
                onImageSelect={setSelectedImage}
                currentImageUrl={currentImageUrl}
                disabled={isSubmitting}
              />

              {/* 料理名 */}
              <Input
                label="料理名"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="例: カレーライス"
                required
                disabled={isSubmitting}
              />

              {/* 短縮タイトル（カード表示用） */}
              <div>
                <label className="block mb-2 font-handwriting text-notebook-ink text-note-base">
                  カード表示用タイトル（任意）
                </label>
                <p className="text-note-sm text-notebook-ink-light mb-3 font-handwriting">
                  一覧表示で使う短いタイトル（10-12文字）。AIで自動生成できます。
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={displayTitle}
                      onChange={e => setDisplayTitle(e.target.value)}
                      placeholder="例: カレーライス"
                      disabled={isSubmitting}
                      maxLength={15}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleGenerateDisplayTitle}
                    disabled={!title.trim() || isGeneratingTitle || isSubmitting}
                    className="whitespace-nowrap"
                  >
                    {isGeneratingTitle ? '生成中...' : 'AI生成'}
                  </Button>
                </div>
                <p className="text-note-xs text-notebook-ink-light mt-1 font-handwriting opacity-70">
                  {displayTitle.length}/15文字
                </p>
              </div>

              {/* 分量 */}
              <Input
                label="分量"
                type="text"
                value={servings}
                onChange={e => setServings(e.target.value)}
                placeholder="例: 2人分"
                disabled={isSubmitting}
              />

              {/* 材料 */}
              <div>
                <label className="block mb-3 font-handwriting text-notebook-ink text-note-base">
                  材料 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={`ingredient-${ingredient.name}-${ingredient.amount}-${index}`} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="材料名"
                          value={ingredient.name}
                          onChange={e => handleIngredientChange(index, 'name', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="w-24 md:w-32">
                        <Input
                          type="text"
                          placeholder="分量"
                          value={ingredient.amount}
                          onChange={e => handleIngredientChange(index, 'amount', e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveIngredient(index)}
                          disabled={isSubmitting}
                          aria-label={`材料 ${index + 1} を削除`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddIngredient}
                    disabled={isSubmitting}
                  >
                    + 材料を追加
                  </Button>
                </div>
              </div>

              {/* 手順 */}
              <div>
                <label className="block mb-3 font-handwriting text-notebook-ink text-note-base">
                  手順 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={`step-${step.slice(0, 20)}-${index}`} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 mt-2 bg-notebook-accent text-white rounded-full flex items-center justify-center font-handwriting font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <textarea
                        placeholder={`手順 ${index + 1}`}
                        value={step}
                        onChange={e => handleStepChange(index, e.target.value)}
                        className="
                          flex-1 px-4 py-3 min-h-[80px]
                          font-sans text-notebook-ink
                          bg-notebook-white
                          border-2 border-notebook-border
                          rounded-xl
                          transition-all duration-200
                          focus:outline-none focus:border-notebook-accent focus:ring-2 focus:ring-notebook-accent/20
                          placeholder:text-notebook-ink-light placeholder:font-handwriting
                          resize-none
                        "
                        rows={2}
                        disabled={isSubmitting}
                      />
                      {steps.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveStep(index)}
                          disabled={isSubmitting}
                          aria-label={`手順 ${index + 1} を削除`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddStep}
                    disabled={isSubmitting}
                  >
                    + 手順を追加
                  </Button>
                </div>
              </div>

              {/* メモ */}
              <div>
                <label className="block mb-3 font-handwriting text-notebook-ink text-note-base">
                  メモ（任意）
                </label>
                <textarea
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  className="
                    w-full px-4 py-3 min-h-[100px]
                    font-handwriting text-notebook-ink
                    bg-notebook-white
                    border-2 border-notebook-border
                    rounded-xl
                    transition-all duration-200
                    focus:outline-none focus:border-notebook-accent focus:ring-2 focus:ring-notebook-accent/20
                    placeholder:text-notebook-ink-light
                    resize-none
                  "
                  rows={3}
                  placeholder="次回は塩少なめで、子供には辛すぎた、など"
                  disabled={isSubmitting}
                />
              </div>

              {/* ボタン */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? '保存中...' : '保存する'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  キャンセル
                </Button>
              </div>
            </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
