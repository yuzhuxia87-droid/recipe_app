import { useState, useEffect, useRef, ChangeEvent } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // クリーンアップ: コンポーネントアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // 既存のタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 300ms後に検索実行
    debounceTimerRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  const handleClear = () => {
    setQuery('')
    onClear()
  }

  return (
    <div className="relative w-full">
      {/* 検索アイコン */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-notebook-ink-light">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* 検索入力 */}
      <input
        type="text"
        placeholder="料理名や材料で検索..."
        className="
          w-full pl-12 pr-12 py-3 min-h-touch
          font-sans text-notebook-ink
          bg-notebook-white
          border-2 border-notebook-border
          rounded-xl
          transition-all duration-200
          focus:outline-none focus:border-notebook-accent focus:ring-2 focus:ring-notebook-accent/20
          hover:border-notebook-accent/50
          placeholder:text-notebook-ink-light placeholder:font-handwriting
        "
        value={query}
        onChange={handleChange}
      />

      {/* クリアボタン */}
      {query && (
        <button
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            p-2 min-h-touch min-w-touch
            text-notebook-ink-light
            hover:text-notebook-ink
            rounded-lg
            transition-colors duration-200
          "
          onClick={handleClear}
          aria-label="検索をクリア"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
