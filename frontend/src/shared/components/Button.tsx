import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES = {
  primary: 'bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 text-white border-transparent focus:outline-primary-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 text-white border-transparent focus:outline-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white border-transparent focus:outline-red-500',
  outline: 'bg-transparent hover:bg-gray-50 focus:bg-gray-50 text-gray-700 border-gray-300 focus:outline-gray-500',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const LoadingSpinner = () => (
  <svg
    className="-ml-1 mr-2 h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
  
  const variantClasses = VARIANT_CLASSES[variant];
  const sizeClasses = SIZE_CLASSES[size];
  
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return (
    <button
      ref={ref}
      className={allClasses}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-describedby={isLoading ? 'loading-description' : undefined}
      {...props}
    >
      {isLoading && (
        <>
          <LoadingSpinner />
          <span id="loading-description" className="sr-only">
            Cargando...
          </span>
        </>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button'; 