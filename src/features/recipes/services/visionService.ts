import OpenAI from 'openai'
import { ExtractedRecipeData } from '../types/recipe.types'

/**
 * OpenAI GPT-4 Vision APIを使用してレシピスクショから情報を抽出するサービス
 */
class VisionService {
  private client: OpenAI | null = null

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // クライアントサイドで使用（本番では推奨されないが、Viteの環境変数はビルド時に埋め込まれるため許容）
      })
    } else {
      console.warn('⚠️ OpenAI API key not found - using mock mode')
    }
  }

  /**
   * 複数のレシピスクショからレシピ情報を抽出
   */
  async extractRecipeFromImages(images: File[]): Promise<ExtractedRecipeData> {
    if (images.length === 0) {
      throw new Error('No images provided')
    }

    // モックモード：APIキーが設定されていない場合
    if (!this.client) {
      console.warn('⚠️ Using mock data - Gemini API key not configured')
      console.warn('Set VITE_GEMINI_API_KEY in .env.local to use real API')

      // モックデータを返す（開発用）
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: 'カレーライス（サンプル）',
            dishName: 'カレーライス',
            dishNameEnglish: 'curry rice',
            servings: '2人分',
            ingredients: [
              { name: '玉ねぎ', amount: '1個' },
              { name: 'にんじん', amount: '1本' },
              { name: 'じゃがいも', amount: '2個' },
              { name: '豚肉', amount: '200g' },
              { name: 'カレールー', amount: '1/2箱' },
            ],
            steps: [
              '野菜を一口大に切る',
              '鍋で肉と野菜を炒める',
              '水を加えて20分煮込む',
              'カレールーを溶かして10分煮込む',
            ],
            memo: 'これはモックデータです。実際のAPIを使用するには環境変数を設定してください。',
          })
        }, 1500) // 実際のAPI呼び出しをシミュレート
      })
    }

    try {
      // 全ての画像をBase64エンコード（data URL形式）
      const imageDataUrls = await Promise.all(
        images.map(async file => {
          const reader = new FileReader()
          return new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        })
      )

      const prompt = `これらの画像からレシピ情報を抽出してください。画像は料理レシピのスクリーンショットです（Instagram、クックパッド、Webサイトなど）。

以下の情報を抽出し、JSON形式で返してください：

1. title: 料理名（画像に書かれているそのままの名前）
2. dishName: 正規化された料理名（修飾語を除いた一般的な料理名）
   - 例: "野菜たっぷりズボラビビンバ丼" → "ビビンバ"
   - 例: "簡単時短カレーライス" → "カレーライス"
   - 例: "おうち本格麻婆豆腐" → "麻婆豆腐"
3. dishNameEnglish: 料理名の英語表記（国際的に通じる名前）
   - 例: "ビビンバ" → "bibimbap"
   - 例: "カレーライス" → "curry rice"
   - 例: "麻婆豆腐" → "mapo tofu"
4. alternativeEnglishNames: 代替英語表現（配列、画像検索用）
   - dishNameEnglishで見つからない場合に使う、より一般的な英語表現
   - 例: "オムライス" の場合
     - dishNameEnglish: "omurice"
     - alternativeEnglishNames: ["omelet rice", "ketchup rice", "japanese omelet"]
   - 例: "唐揚げ" の場合
     - dishNameEnglish: "karaage"
     - alternativeEnglishNames: ["fried chicken", "japanese fried chicken"]
5. dishCategory: 料理カテゴリ（画像検索用の広い概念）
   - 例: "rice dish", "noodle dish", "soup", "salad", "dessert", "fried food"
6. servings: 分量・人数（文字列、例："2人分"、見つからない場合は空文字列）
7. ingredients: 材料のリスト（配列）
   - 各要素は { "name": "材料名", "amount": "分量" } の形式
8. steps: 手順のリスト（文字列の配列、順番を保持）
9. memo: メモやコツがあれば抽出（文字列、なければ空文字列）

重要な注意点：
- 複数の画像がある場合は、全体を統合して1つのレシピとして抽出してください
- 材料と手順は漏れなく抽出してください
- dishNameは修飾語（「簡単」「時短」「ズボラ」「たっぷり」「本格」など）を削除した正式名称にしてください
- dishNameEnglishは国際的に通じる英語表記にしてください
- alternativeEnglishNamesは、Unsplash等の画像検索で使える一般的な英語表現を2-3個提供してください
- dishCategoryは料理の種類を広いカテゴリで指定してください

**IMPORTANT: 必ず以下の形式でJSONを返してください。alternativeEnglishNamesとdishCategoryは必須フィールドです。**

{
  "title": "ふわふわ卵のオムライス",
  "dishName": "オムライス",
  "dishNameEnglish": "omurice",
  "alternativeEnglishNames": ["omelet rice", "ketchup rice", "japanese omelet"],
  "dishCategory": "rice dish",
  "servings": "2人分",
  "ingredients": [
    { "name": "卵", "amount": "3個" },
    { "name": "ご飯", "amount": "200g" }
  ],
  "steps": [
    "ご飯をケチャップで炒める",
    "卵を半熟に焼く"
  ],
  "memo": "卵は半熟がポイントです"
}

注意: alternativeEnglishNames と dishCategory は省略せず、必ず含めてください。`

      // OpenAI GPT-4 Vision APIに送信
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o', // GPT-4 with vision
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              ...imageDataUrls.map(url => ({
                type: 'image_url' as const,
                image_url: { url },
              })),
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.2, // 低めの温度で安定した出力
      })

      const text = response.choices[0]?.message?.content || ''
      if (!text) {
        throw new Error('OpenAI APIからのレスポンスが空です')
      }

      // JSONを抽出（```json ... ``` の中身、または直接JSON）
      let jsonText = text.trim()
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1] || ''
      } else {
        // コードブロックなしの場合、```で囲まれているか確認
        const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/)
        if (codeBlockMatch) {
          jsonText = codeBlockMatch[1] || ''
        }
      }

      const extracted = JSON.parse(jsonText) as ExtractedRecipeData

      // バリデーション
      if (!extracted.title || extracted.title.trim() === '') {
        throw new Error('レシピのタイトルを抽出できませんでした')
      }

      if (!extracted.dishName || extracted.dishName.trim() === '') {
        throw new Error('料理名を抽出できませんでした')
      }

      if (!extracted.dishNameEnglish || extracted.dishNameEnglish.trim() === '') {
        throw new Error('料理名の英語表記を抽出できませんでした')
      }

      if (!extracted.ingredients || extracted.ingredients.length === 0) {
        throw new Error('材料を抽出できませんでした')
      }

      if (!extracted.steps || extracted.steps.length === 0) {
        throw new Error('手順を抽出できませんでした')
      }

      console.log('✅ OpenAI抽出結果:', {
        title: extracted.title,
        dishName: extracted.dishName,
        dishNameEnglish: extracted.dishNameEnglish,
        alternativeEnglishNames: extracted.alternativeEnglishNames,
        dishCategory: extracted.dishCategory,
        ingredientsCount: extracted.ingredients.length,
        stepsCount: extracted.steps.length
      })

      return {
        title: extracted.title.trim(),
        dishName: extracted.dishName.trim(),
        dishNameEnglish: extracted.dishNameEnglish.trim(),
        alternativeEnglishNames: extracted.alternativeEnglishNames || [],
        dishCategory: extracted.dishCategory?.trim() || undefined,
        servings: extracted.servings?.trim() || undefined,
        ingredients: extracted.ingredients.map(ing => ({
          name: ing.name.trim(),
          amount: ing.amount.trim(),
        })),
        steps: extracted.steps.map(step => step.trim()),
        memo: extracted.memo?.trim() || undefined,
      }
    } catch (error) {
      console.error('Vision API error:', error)
      if (error instanceof Error) {
        throw new Error(`レシピの抽出に失敗しました: ${error.message}`)
      }
      throw new Error('レシピの抽出に失敗しました')
    }
  }

  /**
   * フルタイトルから短縮タイトルを生成（カード表示用、1行に収まる長さ）
   */
  async generateDisplayTitle(fullTitle: string): Promise<string> {
    // モックモード：APIキーが設定されていない場合
    if (!this.client) {
      console.warn('⚠️ OpenAI API not available - using simplified title logic')
      // 簡易的なルールベース短縮（モック）
      if (fullTitle.length <= 12) {
        return fullTitle
      }
      // 修飾語を削除
      const simplified = fullTitle
        .replace(/^(簡単|時短|ズボラ|本格|おうち|手作り|たっぷり|濃厚|ヘルシー|美味しい)/, '')
        .trim()

      // 14文字以内なら返す、それ以上なら元のタイトルをそのまま返す
      return simplified.length <= 14 ? simplified : fullTitle
    }

    try {

      const prompt = `以下のレシピタイトルを、カード表示用の短縮タイトルに変換してください。

【前提】
- 最大12-14文字（モバイルで2行に収まる長さ）
- 推奨は10文字以内（1行で収まる）
- 料理の本質が分かる名前にする

【削除すべき修飾語】
以下のような主観的・一般的な修飾語は削除してください：
- 作り方：「簡単」「時短」「手作り」「手づくり」「おうち」「トースターで」
- 量・程度：「たっぷり」「ズボラ」「濃厚」
- 食感・状態：「ふわふわ」「サクサク」「シンプル」
- その他：「美味しい」「ヘルシー」「〜で作る」

【保持すべき要素】
- 料理の種類：「パスタ」「カレー」「丼」「タルト」「スコーン」など（必ず残す）
- 特徴的な材料・調味料：「ナンプラー」「パクチー」「サグ」「バニラ」など
- 地域・スタイル：「スペイン風」「タイ風」など（料理の特徴として重要な場合のみ）

【短縮の具体例】
✓ 「野菜たっぷりズボラビビンバ丼」→「ビビンバ丼」
  （「たっぷり」「ズボラ」は削除、「丼」は保持）
✓ 「手づくりサグカレー」→「サグカレー」
  （「手づくり」は削除、「サグ」は特徴的なので保持）
✓ 「トースターで簡単シンプルスイートポテト」→「スイートポテト」
  （「トースターで」「簡単」「シンプル」は削除）
✓ 「ナスと豚肉とパクチーのナンプラー和え」→「ナンプラー和え」
  （特徴的な調味料「ナンプラー」を残し、「和え」で料理の種類を示す）
✓ 「ベーコンとほうれん草のパスタ」→「ほうれん草パスタ」
  （「パスタ」は必ず残す、特徴的な材料を1つ残す）
✓ 「スペイン風オムレツ」→「スペイン風オムレツ」
  （すでに短いのでそのまま、「スペイン風」は料理の特徴）

【変換対象】
「${fullTitle}」

短縮タイトルのみを返してください（説明や記号は不要）。自然な日本語になるよう注意してください。`

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // 短縮タイトル生成には軽量モデルで十分
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      })

      const displayTitle = response.choices[0]?.message?.content?.trim() || fullTitle

      return displayTitle
    } catch (error) {
      console.error('❌ Display title generation failed:', error)

      // エラーの種類を判定
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // Rate limit エラーの場合は警告
        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate')) {
          console.warn('⚠️ OpenAI API rate limit exceeded. Consider upgrading your plan or waiting a bit.')
        }

        // モデルが見つからないエラーの場合は警告
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          console.error('❌ OpenAI model not found. Check the model name in visionService.ts')
        }
      }

      // フォールバック: 元のタイトルをそのまま返す（切り捨てない）
      console.warn(`⚠️ Using original title as fallback: "${fullTitle}"`)
      return fullTitle
    }
  }
}

export const visionService = new VisionService()
