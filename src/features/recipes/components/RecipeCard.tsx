import { Recipe } from '../types/recipe.types'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      className="card bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-accent/20"
      onClick={onClick}
    >
      {recipe.thumbnail_url && (
        <figure className="px-4 pt-4">
          <img
            src={recipe.thumbnail_url}
            alt={recipe.title}
            className="rounded-lg h-48 w-full object-cover"
            loading="lazy"
          />
        </figure>
      )}
      <div className="card-body">
        <h3 className="card-title font-handwriting text-ink">{recipe.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(recipe.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {recipe.memo && <p className="text-sm text-gray-700 line-clamp-2">{recipe.memo}</p>}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="badge badge-sm badge-outline">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
