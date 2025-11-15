import { useState, ChangeEvent } from 'react'

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
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-base">料理の写真（任意）</span>
      </label>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="プレビュー"
            className="w-full max-h-96 object-contain rounded-lg border-2 border-accent/20"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
        disabled={disabled}
      />
      <label className="label">
        <span className="label-text-alt text-gray-600">
          JPG, PNG, WEBP形式（自動でWebPに変換されます）
        </span>
      </label>
    </div>
  )
}
