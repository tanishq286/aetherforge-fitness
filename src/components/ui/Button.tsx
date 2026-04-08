import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  isLoading?: boolean
}

export const Button = ({ children, className = '', variant = 'primary', isLoading = false, ...props }: ButtonProps) => {
  const baseStyles = "px-8 py-3 font-heading font-[800] text-xl transition-all duration-300 parallelogram-clip disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider h-[56px] flex items-center justify-center min-w-[200px]"
  const variants = {
    primary: "bg-accent text-black hover:bg-orange-600 shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)]",
    outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent/10"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          <span>PLEASE WAIT...</span>
        </div>
      ) : children}
    </button>
  )
}
