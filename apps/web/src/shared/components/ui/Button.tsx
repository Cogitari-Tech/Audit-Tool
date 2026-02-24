import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"; // Added ghost
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-sm shadow-sm ${
          variant === "primary"
            ? "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:brightness-90"
            : variant === "secondary"
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
              : variant === "danger"
                ? "bg-destructive text-destructive-foreground hover:brightness-110 hover:shadow-lg hover:shadow-destructive/20"
                : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground" // ghost style
        } ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
