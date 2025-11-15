import { createApi } from 'unsplash-js'

/**
 * Unsplash APIを使用して料理写真を取得するサービス
 */
class UnsplashService {
  private client: ReturnType<typeof createApi> | null = null

  constructor() {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
    if (accessKey) {
      this.client = createApi({
        accessKey,
      })
    }
  }

  /**
   * 料理名から関連する料理写真を取得
   * @param dishName 料理名（英語推奨、例：「bibimbap」「curry rice」）
   * @returns 画像URL
   */
  async getFoodImage(dishName: string): Promise<string | null> {
    if (!this.client) {
      console.warn('⚠️ Unsplash API key is not configured, skipping image fetch')
      return null
    }

    if (!dishName || dishName.trim() === '') {
      console.warn('⚠️ Dish name is empty')
      return null
    }

    try {
      console.log(`🔍 Unsplash検索開始: "${dishName} food"`)

      // 英語の料理名 + "food" で検索（最も精度が高い）
      const result = await this.client.search.getPhotos({
        query: `${dishName} food`,
        orientation: 'landscape',
        perPage: 5, // 上位5件取得
      })

      if (result.type === 'error') {
        console.error('❌ Unsplash API error:', result.errors)
        return null
      }

      const photos = result.response.results
      console.log(`📸 Unsplash検索結果: ${photos.length}件`)

      if (photos.length === 0) {
        console.warn('⚠️ 画像が見つかりませんでした')
        return null
      }

      // 最も関連性の高い写真を返す（Unsplashが関連度順にソート済み）
      const selectedPhoto = photos[0]
      console.log(`✅ 選択された画像: ${selectedPhoto?.alt_description || 'No description'}`)
      return selectedPhoto?.urls.regular || null
    } catch (error) {
      console.error('❌ Failed to fetch food image from Unsplash:', error)
      return null
    }
  }

  /**
   * 画像URLから画像データを取得してFileオブジェクトに変換
   * （イラスト風変換のためにFileオブジェクトが必要）
   */
  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }
}

export const unsplashService = new UnsplashService()
