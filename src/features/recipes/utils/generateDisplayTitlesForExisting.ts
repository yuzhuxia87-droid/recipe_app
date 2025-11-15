import { recipeService } from '../services/recipeService'
import { visionService } from '../services/visionService'

/**
 * 既存レシピ全てに短縮タイトルを一括生成するユーティリティ
 *
 * 使い方：
 * ブラウザのコンソールで以下を実行:
 * import { generateDisplayTitlesForExisting } from './src/features/recipes/utils/generateDisplayTitlesForExisting'
 * await generateDisplayTitlesForExisting()
 */
export async function generateDisplayTitlesForExisting() {
  console.log('🚀 既存レシピの短縮タイトル生成を開始...')

  try {
    // 全レシピ取得
    const recipes = await recipeService.getAll()
    console.log(`📊 ${recipes.length}件のレシピを処理します`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const recipe of recipes) {
      // すでにdisplayTitleがある場合はスキップ
      if (recipe.displayTitle) {
        console.log(`⏭️  スキップ: "${recipe.title}" (既に短縮タイトルあり)`)
        skipCount++
        continue
      }

      try {
        console.log(`🔄 処理中: "${recipe.title}"`)

        // 短縮タイトルを生成
        const displayTitle = await visionService.generateDisplayTitle(recipe.title)

        // レシピを更新
        await recipeService.update(recipe.id, { displayTitle })

        console.log(`✅ 完了: "${recipe.title}" → "${displayTitle}"`)
        successCount++

        // API Rate Limitを避けるため少し待機
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ エラー: "${recipe.title}"`, error)
        errorCount++
      }
    }

    console.log('\n📈 処理結果:')
    console.log(`  成功: ${successCount}件`)
    console.log(`  スキップ: ${skipCount}件`)
    console.log(`  エラー: ${errorCount}件`)
    console.log('✨ 完了しました！')

    return {
      total: recipes.length,
      success: successCount,
      skipped: skipCount,
      errors: errorCount,
    }
  } catch (error) {
    console.error('💥 処理に失敗しました:', error)
    throw error
  }
}
