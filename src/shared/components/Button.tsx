import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  // 手書き風の柔らかいスタイル
  const baseStyles = `
    font-handwriting font-medium
    rounded-xl
    transition-all duration-200 ease-out
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-sm hover:shadow-md
    border-2
  `

  const variantStyles = {
    primary: `
      bg-notebook-accent text-white
      border-notebook-accent
      hover:bg-notebook-accent/90
      active:bg-notebook-accent/80
    `,
    secondary: `
      bg-notebook-white text-notebook-ink
      border-notebook-border
      hover:border-notebook-accent
      hover:bg-notebook-highlight
    `,
    danger: `
      bg-red-50 text-red-700
      border-red-200
      hover:bg-red-100
      hover:border-red-300
    `,
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-touch',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
