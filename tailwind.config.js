/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 手帳風カラーパレット（2025年モダン）
        notebook: {
          // ページ背景（切り替え可能な複数パターン）
          page: {
            white: '#FAFAF8',    // 白いノート用紙（デフォルト）
            cream: '#FAF7F0',    // クリーム色（旧デフォルト）
            craft: '#F5F0E8',    // クラフト紙風
          },
          // カード背景
          card: '#FFFFFF',       // 純白（ページより明るい）
          // テキスト
          ink: '#2C2416',        // メインテキスト
          'ink-light': '#5C5446', // サブテキスト
          // アクセント
          accent: '#E89B7D',      // アクセント（コーラルピンク）
          'accent-light': '#F4C4B4', // アクセント淡色
          highlight: '#FFF4D6',   // ハイライト（蛍光ペン風）
          // 罫線・枠線
          border: '#E5DDD1',      // 罫線（薄い）
          'border-dark': '#D4C4B4', // 罫線（濃い）
        },
        // マスキングテープカラー
        tape: {
          yellow: '#FFE55C',
          blue: '#A8D8EA',
          pink: '#FFB6C1',
          green: '#B8E6B8',
          orange: '#FFD4A3',
        },
        // 後方互換性のため残す（将来的に削除予定）
        paper: '#F9F6F0',
        ink: '#2C2C2C',
        accent: '#D4A574',
        cream: '#FFF9E6',
      },
      fontFamily: {
        handwriting: ['Zen Maru Gothic', 'sans-serif'],  // 丸ゴシック（親しみやすい）
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      spacing: {
        // 手帳風の余白システム
        'card-padding': '1.5rem',
        'card-gap': '1.5rem',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        // レイヤー構造の影（下に行くほど強い = 高く浮いている）
        'card': '2px 4px 8px rgba(44, 36, 22, 0.08)',           // レシピカード
        'card-hover': '4px 8px 16px rgba(44, 36, 22, 0.12)',    // ホバー時
        'card-lifted': '3px 6px 12px rgba(44, 36, 22, 0.1)',    // タイトルカード（少し高い）
        'tape': '1px 2px 4px rgba(0, 0, 0, 0.15)',              // マスキングテープ
        'fab': '4px 8px 20px rgba(44, 36, 22, 0.15)',           // フローティングボタン
      },
      backgroundImage: {
        // 方眼グリッド（ノート下敷き風）
        'grid-paper': `
          linear-gradient(to right, #E5DDD1 1px, transparent 1px),
          linear-gradient(to bottom, #E5DDD1 1px, transparent 1px)
        `,
        // 紙のテクスチャ（わずかなノイズ）
        'paper-texture': `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
      },
      backgroundSize: {
        'grid': '20px 20px',  // 方眼のサイズ
      },
      // z-index 体系（レイヤー管理）
      zIndex: {
        'texture': '0',       // 紙のテクスチャ
        'content': '10',      // コンテンツ
        'tape': '20',         // マスキングテープ
        'fab': '50',          // フローティングボタン
      },
      // タイポグラフィスケール（2025年ベストプラクティス準拠）
      fontSize: {
        'note-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],      // 12px - タグなど（最小サイズ）
        'note-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],     // 14px - 日付、サブテキスト
        'note-base': ['1rem', { lineHeight: '1.6', letterSpacing: '0.02em' }],       // 16px - 本文
        'note-lg': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],     // 18px - カードタイトル（モバイル）
        'note-xl': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],      // 20px - カードタイトル（デスクトップ）
        'note-2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],      // 24px - ページタイトル（モバイル）
        'note-3xl': ['2rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],        // 32px - ページタイトル（デスクトップ）
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spring': 'spring 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        spring: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      // タッチターゲットサイズ（モバイルファースト）
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      // 8pxグリッドシステム + セマンティックな余白
      spacing: {
        '0': '0',
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '5': '1.25rem',  // 20px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '10': '2.5rem',  // 40px
        '12': '3rem',    // 48px
        // セマンティックな余白（意味を持つ名前）
        'section': '2rem',        // 32px - セクション間
        'section-sm': '1.5rem',   // 24px - セクション内
        'card-padding': '1rem',   // 16px - カード内余白
        'card-gap': '1rem',       // 16px - カード間余白
        'card-gap-md': '1.5rem',  // 24px - カード間余白（デスクトップ）
      },
    },
  },
  plugins: [],
}
