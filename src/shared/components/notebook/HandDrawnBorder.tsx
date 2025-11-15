interface HandDrawnBorderProps {
  className?: string
}

/**
 * 手書き風の枠線コンポーネント
 * 検索バーなどの周囲に配置して、手帳感を演出
 * 全体は水平を保ちながら、線がわずかに歪んでいる
 */
export function HandDrawnBorder({ className = '' }: HandDrawnBorderProps) {
  return (
    <svg
      className={`absolute inset-0 pointer-events-none ${className}`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 上辺 */}
      <path
        d="M 8 8 Q 25 7, 50 8 T 100 8 T 150 8 T 200 8 T 250 8 T 300 8 L calc(100% - 8) 8"
        stroke="#E5DDD1"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 右辺 */}
      <path
        d="M calc(100% - 8) 8 Q calc(100% - 7) 25, calc(100% - 8) 50 T calc(100% - 8) calc(100% - 8)"
        stroke="#E5DDD1"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 下辺 */}
      <path
        d="M calc(100% - 8) calc(100% - 8) Q calc(100% - 50) calc(100% - 7), calc(100% - 100) calc(100% - 8) T 8 calc(100% - 8)"
        stroke="#E5DDD1"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 左辺 */}
      <path
        d="M 8 calc(100% - 8) Q 7 calc(100% - 50), 8 calc(100% - 100) T 8 8"
        stroke="#E5DDD1"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* 角の丸み（4隅） */}
      <path
        d="M 8 8 Q 8 8, 8 8"
        stroke="#E5DDD1"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
