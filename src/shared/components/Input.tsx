import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-handwriting text-notebook-ink text-sm">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 min-h-touch
            font-sans text-notebook-ink
            bg-notebook-white
            border-2 border-notebook-border
            rounded-xl
            transition-all duration-200
            focus:outline-none focus:border-notebook-accent focus:ring-2 focus:ring-notebook-accent/20
            hover:border-notebook-accent/50
            placeholder:text-notebook-ink-light placeholder:font-handwriting
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 font-handwriting">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
