import { useState, ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'

interface RecipeScreenshotUploadProps {
  onImagesSelected: (images: File[]) => void
  disabled?: boolean
}

/**
 * 複数のレシピスクリーンショットをアップロードするコンポーネント
 */
export function RecipeScreenshotUpload({
  onImagesSelected,
  disabled = false,
}: RecipeScreenshotUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      return
    }

    // 既存の画像に追加
    const newImages = [...selectedImages, ...imageFiles]
    setSelectedImages(newImages)

    // プレビューURLを生成
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])

    // 親コンポーネントに通知
    onImagesSelected(newImages)

    // input要素をリセット（同じファイルを再選択可能にする）
    e.target.value = ''
  }

  const handleRemoveImage = (index: number) => {
    // プレビューURLをクリーンアップ
    URL.revokeObjectURL(previewUrls[index] || '')

    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)

    setSelectedImages(newImages)
    setPreviewUrls(newPreviewUrls)
    onImagesSelected(newImages)
  }

  const handleClearAll = () => {
    // 全てのプレビューURLをクリーンアップ
    previewUrls.forEach(url => URL.revokeObjectURL(url))

    setSelectedImages([])
    setPreviewUrls([])
    onImagesSelected([])
  }

  return (
    <div className="space-y-4">
      <label className="block font-handwriting text-notebook-ink text-note-base font-medium">
        レシピのスクリーンショット
      </label>

      {/* ファイル選択ボタン */}
      <div className="flex flex-wrap gap-3">
        <label
          className="inline-flex items-center justify-center px-6 py-3 min-h-touch font-handwriting text-note-base bg-notebook-white text-notebook-ink border-2 border-notebook-border rounded-xl cursor-pointer transition-all duration-200 hover:border-notebook-accent hover:bg-notebook-accent-light active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          htmlFor="screenshot-upload"
        >
          <Camera className="h-5 w-5 mr-2" />
          {selectedImages.length > 0 ? '画像を追加' : '画像を選択'}
        </label>
        <input
          id="screenshot-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        {selectedImages.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled}
            className="inline-flex items-center justify-center px-6 py-3 min-h-touch font-handwriting text-note-base text-notebook-ink-light hover:text-notebook-ink border-2 border-transparent hover:border-notebook-border rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            全て削除
          </button>
        )}
      </div>

      {/* プレビュー表示 */}
      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <p className="text-note-sm text-notebook-ink-light font-handwriting">
            {selectedImages.length}枚選択中
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`スクリーンショット ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-notebook-border shadow-card"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white border-2 border-notebook-border text-notebook-ink rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-400 hover:text-red-600 active:scale-95 disabled:opacity-50"
                  aria-label={`画像 ${index + 1} を削除`}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-notebook-ink/70 text-white text-note-xs px-2 py-1 rounded font-handwriting">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 説明テキスト */}
      {selectedImages.length === 0 && (
        <div className="space-y-2">
          <p className="text-note-sm text-notebook-ink-light font-handwriting leading-relaxed">
            Instagramやクックパッドなどのレシピ画像を選択してください。
          </p>
          <p className="text-note-sm text-notebook-ink-light font-handwriting leading-relaxed">
            複数画面に分かれている場合は全て選択してください。
          </p>
        </div>
      )}
    </div>
  )
}
