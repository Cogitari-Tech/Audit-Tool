import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"; // Added ghost
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 ${
          variant === "primary"
            ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-brand-500/30"
            : variant === "secondary"
              ? "clay text-slate-700 dark:text-slate-200 hover:-translate-y-0.5"
              : variant === "danger"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/30"
                : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-white/5 hover:text-brand-500 dark:hover:text-brand-400" // ghost style
        } ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
