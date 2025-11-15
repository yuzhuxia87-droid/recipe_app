import { useState } from 'react'
import { generateDisplayTitlesForExisting } from '../utils/generateDisplayTitlesForExisting'
import toast from 'react-hot-toast'

/**
 * 管理者用ツールコンポーネント
 * 既存レシピの一括処理などを実行
 */
export function AdminTools() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{
    total: number
    success: number
    skipped: number
    errors: number
  } | null>(null)

  const handleGenerateDisplayTitles = async () => {
    if (!confirm('既存レシピ全てに短縮タイトルを生成しますか？\n（API使用料が発生します）')) {
      return
    }

    try {
      setIsGenerating(true)
      toast.loading('短縮タイトルを生成中...', { id: 'generating' })

      const result = await generateDisplayTitlesForExisting()
      setResult(result)

      toast.success(`完了！成功: ${result.success}件`, { id: 'generating' })
    } catch (error) {
      console.error('一括生成エラー:', error)
      toast.error('生成に失敗しました', { id: 'generating' })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">管理者ツール</h2>

        <div className="space-y-4">
          {/* 短縮タイトル一括生成 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">短縮タイトル一括生成</h3>
            <p className="text-sm text-gray-600 mb-3">
              既存レシピ全てにAIで短縮タイトルを自動生成します。
              <br />
              すでに短縮タイトルがあるレシピはスキップされます。
            </p>

            <button
              onClick={handleGenerateDisplayTitles}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '一括生成を実行'}
            </button>

            {result && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <p className="font-semibold mb-2">実行結果:</p>
                <ul className="space-y-1">
                  <li>✅ 成功: {result.success}件</li>
                  <li>⏭️ スキップ: {result.skipped}件</li>
                  <li>❌ エラー: {result.errors}件</li>
                  <li className="font-semibold mt-2">合計: {result.total}件</li>
                </ul>
              </div>
            )}
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ 注意:</strong> Gemini API使用料が発生します。
              レシピ数が多い場合は費用にご注意ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
