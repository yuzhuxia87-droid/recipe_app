interface RecipePlaceholderProps {
  category?: string | null
}

/**
 * レシピ画像のプレースホルダーコンポーネント
 * カテゴリに応じた手書き風アイコンを表示
 */
export function RecipePlaceholder({ category }: RecipePlaceholderProps) {
  // カテゴリに応じたアイコンとカラーを取得
  const getIconConfig = () => {
    switch (category) {
      case 'rice dish':
        return {
          icon: <RiceDishIcon />,
          bgColor: 'from-amber-50 to-orange-50',
          borderColor: 'border-amber-300/50',
          label: 'ご飯',
        }
      case 'noodle dish':
        return {
          icon: <NoodleDishIcon />,
          bgColor: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-300/50',
          label: '麺類',
        }
      case 'soup':
        return {
          icon: <SoupIcon />,
          bgColor: 'from-orange-50 to-red-50',
          borderColor: 'border-orange-300/50',
          label: 'スープ',
        }
      case 'salad':
        return {
          icon: <SaladIcon />,
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-300/50',
          label: 'サラダ',
        }
      case 'dessert':
        return {
          icon: <DessertIcon />,
          bgColor: 'from-pink-50 to-rose-50',
          borderColor: 'border-pink-300/50',
          label: 'デザート',
        }
      default:
        return {
          icon: <DefaultFoodIcon />,
          bgColor: 'from-amber-50 to-amber-100',
          borderColor: 'border-amber-300/50',
          label: '料理',
        }
    }
  }

  const { icon, bgColor, borderColor, label } = getIconConfig()

  return (
    <div
      className={`rounded-lg w-full aspect-square bg-gradient-to-br ${bgColor} flex flex-col items-center justify-center border-2 border-dashed ${borderColor}`}
    >
      {/* アイコン */}
      <div className="mb-2">{icon}</div>
      {/* カテゴリラベル（手書き風フォント） */}
      <p className="text-xs font-handwriting text-amber-600/60">{label}</p>
    </div>
  )
}

/**
 * ご飯系の手書き風アイコン
 */
function RiceDishIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 茶碗（手書き風の歪んだ曲線） */}
      <path
        d="M 20 35 Q 18 38 18 42 Q 18 50 22 55 Q 26 60 32 62 Q 38 64 40 64 Q 42 64 48 62 Q 54 60 58 55 Q 62 50 62 42 Q 62 38 60 35"
        stroke="#d97706"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 茶碗の上部の楕円（手書き風） */}
      <ellipse
        cx="40"
        cy="35"
        rx="21"
        ry="6"
        stroke="#d97706"
        strokeWidth="2.5"
        fill="#fef3c7"
        opacity="0.6"
      />
      {/* ご飯粒（小さな丸）手書き風に少し歪ませる */}
      <circle cx="35" cy="32" r="2" fill="#d97706" opacity="0.4" />
      <circle cx="42" cy="30" r="2.5" fill="#d97706" opacity="0.4" />
      <circle cx="38" cy="28" r="2" fill="#d97706" opacity="0.4" />
      <circle cx="44" cy="33" r="2" fill="#d97706" opacity="0.4" />
      <circle cx="40" cy="25" r="2.5" fill="#d97706" opacity="0.4" />
    </svg>
  )
}

/**
 * 麺類の手書き風アイコン
 */
function NoodleDishIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 丼（手書き風の歪んだ曲線） */}
      <path
        d="M 22 38 Q 20 42 20 46 Q 20 52 24 56 Q 28 60 34 62 Q 38 63 40 63 Q 42 63 46 62 Q 52 60 56 56 Q 60 52 60 46 Q 60 42 58 38"
        stroke="#ca8a04"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 丼の上部の楕円 */}
      <ellipse
        cx="40"
        cy="38"
        rx="19"
        ry="5"
        stroke="#ca8a04"
        strokeWidth="2.5"
        fill="#fef9c3"
        opacity="0.5"
      />
      {/* 麺（手書き風のうねった線） */}
      <path
        d="M 28 35 Q 30 28 32 25 Q 34 22 36 24"
        stroke="#ca8a04"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 38 36 Q 40 30 42 26 Q 43 23 45 25"
        stroke="#ca8a04"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 46 35 Q 48 29 50 26 Q 51 24 52 26"
        stroke="#ca8a04"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

/**
 * スープの手書き風アイコン
 */
function SoupIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* カップ */}
      <path
        d="M 25 40 Q 24 44 24 48 Q 24 54 28 58 Q 32 62 38 63 Q 42 64 44 63 Q 50 62 54 58 Q 58 54 58 48 Q 58 44 57 40"
        stroke="#ea580c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="41"
        cy="40"
        rx="17"
        ry="5"
        stroke="#ea580c"
        strokeWidth="2.5"
        fill="#fed7aa"
        opacity="0.5"
      />
      {/* 湯気（手書き風のうねり） */}
      <path
        d="M 32 32 Q 30 28 32 24"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 41 30 Q 39 26 41 22"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 50 32 Q 52 28 50 24"
        stroke="#ea580c"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

/**
 * サラダの手書き風アイコン
 */
function SaladIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ボウル */}
      <path
        d="M 22 42 Q 20 46 20 50 Q 20 56 24 60 Q 28 64 34 65 Q 38 66 40 66 Q 42 66 46 65 Q 52 64 56 60 Q 60 56 60 50 Q 60 46 58 42"
        stroke="#16a34a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="40"
        cy="42"
        rx="19"
        ry="5"
        stroke="#16a34a"
        strokeWidth="2.5"
        fill="#d1fae5"
        opacity="0.5"
      />
      {/* 葉っぱ（手書き風） */}
      <ellipse
        cx="32"
        cy="35"
        rx="6"
        ry="10"
        fill="#16a34a"
        opacity="0.3"
        transform="rotate(-20 32 35)"
      />
      <ellipse
        cx="40"
        cy="32"
        rx="6"
        ry="11"
        fill="#16a34a"
        opacity="0.3"
      />
      <ellipse
        cx="48"
        cy="35"
        rx="6"
        ry="10"
        fill="#16a34a"
        opacity="0.3"
        transform="rotate(20 48 35)"
      />
    </svg>
  )
}

/**
 * デザートの手書き風アイコン
 */
function DessertIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ケーキの土台（台形） */}
      <path
        d="M 28 55 L 24 65 L 56 65 L 52 55 Z"
        fill="#fce7f3"
        stroke="#ec4899"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* ケーキの中段 */}
      <path
        d="M 30 45 L 28 55 L 52 55 L 50 45 Z"
        fill="#fbcfe8"
        stroke="#ec4899"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* ケーキの上段 */}
      <path
        d="M 34 35 L 32 45 L 48 45 L 46 35 Z"
        fill="#f9a8d4"
        stroke="#ec4899"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* ろうそく */}
      <line
        x1="40"
        y1="35"
        x2="40"
        y2="25"
        stroke="#ec4899"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 炎 */}
      <ellipse
        cx="40"
        cy="22"
        rx="3"
        ry="5"
        fill="#fb923c"
        opacity="0.6"
      />
    </svg>
  )
}

/**
 * デフォルトの料理アイコン（フォークとナイフ）
 */
function DefaultFoodIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* フォーク（左側） */}
      <line x1="28" y1="25" x2="28" y2="60" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="25" x2="24" y2="38" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="25" x2="32" y2="38" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <path d="M 24 38 Q 26 40 28 40 Q 30 40 32 38" stroke="#d97706" strokeWidth="2" fill="none" />

      {/* ナイフ（右側） */}
      <line x1="52" y1="25" x2="52" y2="60" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M 48 25 L 52 25 L 54 28 L 54 35 L 52 38 L 48 38 Z"
        fill="#d97706"
        opacity="0.4"
      />
    </svg>
  )
}
