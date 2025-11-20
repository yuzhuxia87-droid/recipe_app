interface ImagePreviewModalProps {
  isOpen: boolean
  imageUrl: string | null
  dishName: string
  onConfirm: (useImage: boolean) => void
  onClose: () => void
}

/**
 * レシピ画像のプレビュー・確認モーダル
 *
 * AI抽出後にUnsplashから取得した画像をユーザーに確認してもらい、
 * 使用するかどうかを選択できるようにする。
 */
export function ImagePreviewModal({
  isOpen,
  imageUrl,
  dishName,
  onConfirm,
  onClose,
}: ImagePreviewModalProps) {
  if (!isOpen) return null

  const handleUseImage = () => {
    onConfirm(true)
  }

  const handleSkipImage = () => {
    onConfirm(false)
  }

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* モーダルコンテンツ */}
        <div
          className="bg-notebook-card rounded-card shadow-card-hover border border-notebook-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 紙のテクスチャ */}
          <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none z-texture rounded-card" />

          {/* ヘッダー */}
          <div className="relative z-content p-6 border-b border-notebook-border">
            <h2 className="text-2xl font-handwriting text-notebook-ink">
              この画像でよろしいですか？
            </h2>
            <p className="text-sm text-notebook-ink-light mt-1 font-sans">
              料理名: {dishName}
            </p>
          </div>

          {/* 画像プレビュー */}
          <div className="relative z-content p-6">
            {imageUrl ? (
              <div className="rounded-lg overflow-hidden border-2 border-notebook-border shadow-md">
                <img
                  src={imageUrl}
                  alt={dishName}
                  className="w-full aspect-video object-cover"
                />
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-notebook-border bg-amber-50 p-12 text-center">
                <p className="text-notebook-ink-light font-sans">
                  画像が見つかりませんでした
                </p>
              </div>
            )}
          </div>

          {/* ボタンエリア */}
          <div className="relative z-content p-6 border-t border-notebook-border flex gap-3 justify-end">
            {imageUrl ? (
              <>
                {/* 画像を使う */}
                <button
                  onClick={handleUseImage}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-sans font-medium hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-md"
                >
                  この画像でOK
                </button>

                {/* 画像なしで作成 */}
                <button
                  onClick={handleSkipImage}
                  className="px-6 py-3 bg-notebook-card border border-notebook-border text-notebook-ink rounded-lg font-sans hover:bg-amber-50 active:scale-95 transition-all duration-200"
                >
                  画像なしで作成
                </button>
              </>
            ) : (
              <>
                {/* 画像なしで作成（画像がない場合のデフォルトボタン） */}
                <button
                  onClick={handleSkipImage}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-sans font-medium hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-md"
                >
                  画像なしで作成
                </button>

                {/* キャンセル */}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-notebook-card border border-notebook-border text-notebook-ink rounded-lg font-sans hover:bg-amber-50 active:scale-95 transition-all duration-200"
                >
                  キャンセル
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
