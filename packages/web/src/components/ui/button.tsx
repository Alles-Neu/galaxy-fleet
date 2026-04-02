import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-white border-transparent',
  secondary: 'bg-[#2a2d38] hover:bg-[#363945] text-gray-200 border-transparent',
  ghost: 'bg-transparent hover:bg-white/10 text-gray-300 border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  outline: 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
