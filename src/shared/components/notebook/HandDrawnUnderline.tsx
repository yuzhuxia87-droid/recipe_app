interface HandDrawnUnderlineProps {
  width?: 'sm' | 'md' | 'lg' | 'full'
  color?: string
  className?: string
}

export function HandDrawnUnderline({
  width = 'full',
  color = 'currentColor',
  className = ''
}: HandDrawnUnderlineProps) {
  // 幅の設定
  const widthClasses = {
    sm: 'w-24',
    md: 'w-48',
    lg: 'w-64',
    full: 'w-full',
  }

  return (
    <svg
      viewBox="0 0 200 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${widthClasses[width]} h-2 ${className}`}
      preserveAspectRatio="none"
    >
      {/* 手書き風の波線 */}
      <path
        d="M 2 4 Q 10 2, 20 4 T 40 4 T 60 4 T 80 4 T 100 4 T 120 4 T 140 4 T 160 4 T 180 4 T 198 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}
