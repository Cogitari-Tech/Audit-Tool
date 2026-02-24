import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-5 py-3.5 text-sm bg-background/50 backdrop-blur-sm border border-border/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all rounded-xl font-medium placeholder:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
