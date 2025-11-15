import { Recipe } from '../types/recipe.types'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
  onToggleFavorite: (id: string) => void
}

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  return (
    <div
      className="group relative bg-notebook-card rounded-card shadow-card hover:shadow-card-hover border border-notebook-border cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* 紙のテクスチャ（わずかなノイズ） */}
      <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none z-texture rounded-card" />

      {/* 画像エリア */}
      {(recipe.illustrated_url || recipe.thumbnail_url) && (
        <div className="relative z-content p-card-padding pb-2">
          <img
            src={recipe.illustrated_url || recipe.thumbnail_url || ''}
            alt={recipe.title}
            className="rounded-lg w-full aspect-square object-cover"
            loading="lazy"
          />

          {/* お気に入りボタン */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(recipe.id)
            }}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 z-content"
            aria-label={recipe.favorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {recipe.favorite ? (
              <svg className="w-5 h-5 fill-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.045 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 stroke-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* コンテンツエリア */}
      <div className="relative z-content px-card-padding pb-card-padding">
        {/* タイトル */}
        <h3 className="font-handwriting font-medium text-note-lg md:text-note-xl text-notebook-ink mb-2 line-clamp-2 break-words">
          {recipe.displayTitle || recipe.title}
        </h3>

        {/* 日付 */}
        <p className="text-note-sm text-notebook-ink-light mb-3 font-sans opacity-70">
          {new Date(recipe.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* タグ */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 text-note-xs rounded-full bg-notebook-accent-light text-notebook-ink font-handwriting"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-1 text-note-xs rounded-full bg-notebook-accent-light text-notebook-ink font-handwriting">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
