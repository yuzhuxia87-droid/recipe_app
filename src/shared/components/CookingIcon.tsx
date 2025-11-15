interface CookingIconProps {
  className?: string
}

export function CookingIcon({ className = '' }: CookingIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 鍋本体（手描き風の揺らぎ） */}
      <path
        d="M10 20 Q10 18, 12 18 L36 18 Q38 18, 38 20 L38 32 Q38 36, 34 36 L14 36 Q10 36, 10 32 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 湯気（かわいい3本線） */}
      <path
        d="M16 14 Q18 12, 16 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M24 14 Q26 11, 24 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M32 14 Q34 12, 32 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* 持ち手（左） */}
      <path
        d="M10 24 L6 24 Q4 24, 4 26 Q4 28, 6 28 L10 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 持ち手（右） */}
      <path
        d="M38 24 L42 24 Q44 24, 44 26 Q44 28, 42 28 L38 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ハイライト（手描き感） */}
      <path
        d="M14 22 Q16 21, 18 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}
