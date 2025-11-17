import { createApi } from 'unsplash-js'
import type { Basic } from 'unsplash-js/dist/methods/photos/types'

/**
 * 料理検索パラメータ
 */
export interface FoodImageSearchParams {
  primaryName: string // メイン検索名（例: "omurice"）
  alternativeNames?: string[] // 代替名（例: ["omelet rice", "ketchup rice"]）
  category?: string // カテゴリ（例: "rice dish"）
}

/**
 * Unsplash APIを使用して料理写真を取得するサービス
 */
class UnsplashService {
  private client: ReturnType<typeof createApi> | null = null

  // 検索設定
  private readonly SEARCH_CONFIG = {
    perPage: 10, // 上位10件取得して品質チェック
    orientation: 'landscape' as const,
    primaryKeyword: 'food',
  }

  // スコアリング閾値（検索段階ごとに異なる）
  private readonly SCORE_THRESHOLDS = {
    primary: 5, // メイン検索: 厳格（料理名の一部が含まれる必要がある）
    alternative: 3, // 代替名検索: やや緩和
    category: 1, // カテゴリ検索: 最低限（foodキーワードがあればOK）
  }

  constructor() {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
    if (accessKey) {
      this.client = createApi({
        accessKey,
      })
    }
  }

  /**
   * 料理名から関連する料理写真を取得（多段階フォールバック戦略）
   *
   * 戦略:
   * 1. "{primaryName} food" で検索 → 閾値5点以上
   * 2. 代替名で検索 → 閾値3点以上
   * 3. カテゴリで検索 → 閾値1点以上
   * 4. 最終フォールバック: 見つかった画像の中から最高スコアを返す
   *
   * @param params 検索パラメータ
   * @returns 画像URL
   */
  async getFoodImage(params: FoodImageSearchParams | string): Promise<string | null> {
    // 後方互換性: string の場合は従来の動作
    if (typeof params === 'string') {
      return this.legacyGetFoodImage(params)
    }
    if (!this.client) {
      console.warn('⚠️ Unsplash API key is not configured, skipping image fetch')
      return null
    }

    const { primaryName, alternativeNames = [], category } = params

    if (!primaryName || primaryName.trim() === '') {
      console.warn('⚠️ Primary dish name is empty')
      return null
    }

    try {
      console.log(`🎯 多段階検索戦略開始:`)
      console.log(`  - メイン: "${primaryName}"`)
      console.log(`  - 代替名: ${alternativeNames.length}件`)
      console.log(`  - カテゴリ: "${category || 'なし'}"`)

      // Step 1: メイン検索 ("{primaryName} food")
      console.log(`\n🔍 [Step 1] メイン検索: "${primaryName} ${this.SEARCH_CONFIG.primaryKeyword}"`)
      const primaryPhotos = await this.searchPhotos(`${primaryName} ${this.SEARCH_CONFIG.primaryKeyword}`)

      if (primaryPhotos.length > 0) {
        const bestPhoto = this.selectBestPhoto(primaryPhotos, primaryName, this.SCORE_THRESHOLDS.primary)

        if (bestPhoto) {
          console.log(`✅ メイン検索で発見: ${bestPhoto.alt_description || 'No description'}`)
          return bestPhoto.urls.regular
        }
        console.log(`⚠️ メイン検索: 閾値${this.SCORE_THRESHOLDS.primary}点未満のためスキップ`)
      }

      // Step 2: 代替名検索
      for (const altName of alternativeNames) {
        console.log(`\n🔍 [Step 2] 代替名検索: "${altName} ${this.SEARCH_CONFIG.primaryKeyword}"`)
        const altPhotos = await this.searchPhotos(`${altName} ${this.SEARCH_CONFIG.primaryKeyword}`)

        if (altPhotos.length > 0) {
          const bestPhoto = this.selectBestPhoto(altPhotos, altName, this.SCORE_THRESHOLDS.alternative)

          if (bestPhoto) {
            console.log(`✅ 代替名検索で発見: ${bestPhoto.alt_description || 'No description'}`)
            return bestPhoto.urls.regular
          }
          console.log(`⚠️ 代替名検索: 閾値${this.SCORE_THRESHOLDS.alternative}点未満のためスキップ`)
        }
      }

      // Step 3: カテゴリ検索
      if (category) {
        console.log(`\n🔍 [Step 3] カテゴリ検索: "${category}"`)
        const categoryPhotos = await this.searchPhotos(category)

        if (categoryPhotos.length > 0) {
          const bestPhoto = this.selectBestPhoto(categoryPhotos, category, this.SCORE_THRESHOLDS.category)

          if (bestPhoto) {
            console.log(`✅ カテゴリ検索で発見: ${bestPhoto.alt_description || 'No description'}`)
            return bestPhoto.urls.regular
          }
        }
      }

      console.warn('❌ すべての検索で適切な画像が見つかりませんでした')
      return null

    } catch (error) {
      console.error('❌ Failed to fetch food image from Unsplash:', error)
      return null
    }
  }

  /**
   * 後方互換性のための旧メソッド
   * @deprecated 新しいコードでは getFoodImage(params) を使用してください
   * @private
   */
  private async legacyGetFoodImage(dishName: string): Promise<string | null> {
    return this.getFoodImage({
      primaryName: dishName,
      alternativeNames: [],
      category: undefined,
    })
  }

  /**
   * Unsplash API で写真を検索
   * @private
   */
  private async searchPhotos(query: string): Promise<Basic[]> {
    if (!this.client) return []

    const result = await this.client.search.getPhotos({
      query,
      orientation: this.SEARCH_CONFIG.orientation,
      perPage: this.SEARCH_CONFIG.perPage,
    })

    if (result.type === 'error') {
      console.error('❌ Unsplash API error:', result.errors)
      return []
    }

    const photos = result.response.results
    console.log(`📸 検索結果: ${photos.length}件`)
    return photos
  }

  /**
   * 検索結果から最も適切な写真を選択
   *
   * 品質チェック基準:
   * 1. alt_description に料理名が含まれている
   * 2. alt_description に "food", "dish", "cuisine" などのキーワードが含まれている
   *
   * @param photos 検索結果の写真リスト
   * @param dishName 料理名（スコアリング用）
   * @param threshold 最低スコア閾値
   * @private
   */
  private selectBestPhoto(photos: Basic[], dishName: string, threshold: number = 1): Basic | null {
    const dishNameLower = dishName.toLowerCase()
    const foodKeywords = ['food', 'dish', 'cuisine', 'meal', 'plate']

    // スコアリング: alt_description の品質を評価
    const scoredPhotos = photos.map(photo => {
      const altDesc = (photo.alt_description || '').toLowerCase()
      let score = 0

      // 料理名が含まれていれば高スコア
      if (altDesc.includes(dishNameLower)) {
        score += 10
      }

      // 料理名の一部（単語）が含まれていればスコア加算
      const dishWords = dishNameLower.split(/\s+/)
      dishWords.forEach(word => {
        if (word.length > 2 && altDesc.includes(word)) {
          score += 3
        }
      })

      // 料理関連キーワードが含まれていればスコア加算
      foodKeywords.forEach(keyword => {
        if (altDesc.includes(keyword)) {
          score += 1
        }
      })

      return { photo, score, altDesc }
    })

    // スコアでソート
    scoredPhotos.sort((a, b) => b.score - a.score)

    // デバッグログ
    console.log('📊 画像品質スコア:')
    scoredPhotos.slice(0, 3).forEach(({ altDesc, score }, index) => {
      console.log(`  ${index + 1}. [${score}点] ${altDesc || '(説明なし)'}`)
    })

    // 動的閾値チェック
    const bestMatch = scoredPhotos[0]

    if (!bestMatch) {
      return null
    }

    if (bestMatch.score >= threshold) {
      return bestMatch.photo
    }

    console.log(`  ⚠️ 最高スコア${bestMatch.score}点は閾値${threshold}点未満`)
    return null
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
