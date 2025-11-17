import { Recipe } from '../types/recipe.types'
import { SortOrder } from '@/store/recipeStore'

/**
 * レシピを指定された順序でソートする純粋関数
 *
 * @param recipes - ソート対象のレシピ配列
 * @param order - ソート順序
 * @returns ソート済みのレシピ配列（元の配列は変更しない）
 */
export function sortRecipes(recipes: Recipe[], order: SortOrder): Recipe[] {
  // 元の配列を変更しないようにコピー
  const recipesCopy = [...recipes]

  switch (order) {
    case 'newest':
      // 新しい順（作成日時の降順）
      return recipesCopy.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

    case 'oldest':
      // 古い順（作成日時の昇順）
      return recipesCopy.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

    case 'name':
      // 名前順（料理名の五十音順）
      return recipesCopy.sort((a, b) =>
        a.title.localeCompare(b.title, 'ja')
      )

    case 'favorites-first':
      // お気に入りを上に表示（お気に入り内では新しい順）
      return recipesCopy.sort((a, b) => {
        // お気に入りのフラグが同じ場合は作成日時で比較
        if (a.favorite === b.favorite) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        // お気に入りを上に
        return a.favorite ? -1 : 1
      })

    default:
      // デフォルトは新しい順
      return recipesCopy.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }
}
