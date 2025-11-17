import { useState, ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  currentImageUrl?: string | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, currentImageUrl, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // プレビュー生成
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onImageSelect(file)

    // input要素をリセット（同じファイルを再選択可能にする）
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      <label className="block font-handwriting text-notebook-ink text-note-base font-medium">
        料理の写真
      </label>

      {/* プレビュー */}
      {preview && (
        <div className="relative group">
          <img
            src={preview}
            alt="料理の写真"
            className="w-full max-h-96 object-contain rounded-lg border-2 border-notebook-border shadow-card"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white border-2 border-notebook-border text-notebook-ink rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-400 hover:text-red-600 active:scale-95 disabled:opacity-50"
            aria-label="画像を削除"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ファイル選択ボタン */}
      <div className="flex flex-col gap-2">
        <label
          className="inline-flex items-center justify-center px-6 py-3 min-h-touch font-handwriting text-note-base bg-notebook-white text-notebook-ink border-2 border-notebook-border rounded-xl cursor-pointer transition-all duration-200 hover:border-notebook-accent hover:bg-notebook-accent-light active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          htmlFor="image-upload"
        >
          <Camera className="h-5 w-5 mr-2" />
          {preview ? '画像を変更' : '画像を選択'}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        <p className="text-note-sm text-notebook-ink-light font-handwriting">
          JPG, PNG, WEBP形式（自動でWebPに変換されます）
        </p>
      </div>
    </div>
  )
}
