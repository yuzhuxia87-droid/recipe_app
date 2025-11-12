import { createBrowserRouter } from 'react-router-dom'
import { RecipeList } from '@/features/recipes/components/RecipeList'
import { RecipeForm } from '@/features/recipes/components/RecipeForm'
import { RecipeDetail } from '@/features/recipes/components/RecipeDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipeList />,
  },
  {
    path: '/recipes/new',
    element: <RecipeForm />,
  },
  {
    path: '/recipes/:id',
    element: <RecipeDetail />,
  },
])
