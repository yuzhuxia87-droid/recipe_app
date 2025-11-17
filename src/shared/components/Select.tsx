import * as SelectPrimitive from '@radix-ui/react-select'
import { ReactNode } from 'react'

// ========================================
// Select Root
// ========================================
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  disabled?: boolean
}

export function Select({ value, onValueChange, children, disabled = false }: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      {children}
    </SelectPrimitive.Root>
  )
}

// ========================================
// Select Trigger（クリックして開くボタン部分）
// ========================================
interface SelectTriggerProps {
  children: ReactNode
  className?: string
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  const baseStyles = `
    inline-flex items-center justify-between
    rounded-xl
    border-2 border-notebook-border
    bg-notebook-highlight/40
    px-4 py-2
    font-handwriting text-note-sm
    text-notebook-ink
    transition-all duration-200
    hover:border-notebook-accent/50
    focus:outline-none
    focus:ring-2 focus:ring-notebook-accent/30
    focus:ring-offset-2 focus:ring-offset-notebook-page-white
    focus:border-notebook-accent
    disabled:cursor-not-allowed
    disabled:opacity-50
    cursor-pointer
    shadow-sm
  `

  return (
    <SelectPrimitive.Trigger className={`${baseStyles} ${className}`.trim()}>
      <SelectPrimitive.Value placeholder={children} />
      <SelectPrimitive.Icon asChild>
        <svg
          className="w-4 h-4 ml-2 text-notebook-ink-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

// ========================================
// Select Content（ドロップダウンメニュー）
// ========================================
interface SelectContentProps {
  children: ReactNode
  className?: string
}

export function SelectContent({ children, className = '' }: SelectContentProps) {
  const baseStyles = `
    overflow-hidden
    rounded-xl
    border-2 border-notebook-border
    bg-notebook-card
    shadow-card
    z-50
  `

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={`${baseStyles} ${className}`.trim()}
        position="popper"
        sideOffset={8}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ========================================
// Select Item（各選択肢）
// ========================================
interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function SelectItem({ value, children, className = '' }: SelectItemProps) {
  const baseStyles = `
    relative
    flex items-center
    px-4 py-2.5
    rounded-lg
    font-handwriting text-note-sm
    text-notebook-ink
    cursor-pointer
    transition-colors duration-150
    select-none
    outline-none
    data-[highlighted]:bg-notebook-highlight/40
    data-[highlighted]:text-notebook-ink
    data-[disabled]:opacity-50
    data-[disabled]:pointer-events-none
  `

  return (
    <SelectPrimitive.Item value={value} className={`${baseStyles} ${className}`.trim()}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}
