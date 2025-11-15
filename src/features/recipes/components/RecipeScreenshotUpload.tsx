import { useState, ChangeEvent } from 'react'

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
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-base">
          レシピのスクリーンショット（複数可）
        </span>
      </label>

      {/* ファイル選択ボタン */}
      <div className="mb-4">
        <label className="btn btn-secondary btn-sm" htmlFor="screenshot-upload">
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
            className="btn btn-ghost btn-sm ml-2"
          >
            全て削除
          </button>
        )}
      </div>

      {/* プレビュー表示 */}
      {selectedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{selectedImages.length}枚選択中</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`スクリーンショット ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={disabled}
                  className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`画像 ${index + 1} を削除`}
                >
                  ✕
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 説明テキスト */}
      {selectedImages.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Instagramやクックパッドなどのレシピスクリーンショットを選択してください。
          <br />
          レシピが複数画面に分かれている場合は、全て選択してください。
        </p>
      )}
    </div>
  )
}
