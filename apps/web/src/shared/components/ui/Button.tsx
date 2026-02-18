import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          variant === 'primary'
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : variant === 'secondary'
            ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            : 'bg-red-600 text-white hover:bg-red-700'
        } ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
