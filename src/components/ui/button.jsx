import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  
  // Base structural classes explicitly preventing misalignments
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  // High-fidelity aesthetic variations matching our glassmorphic theme
  const variants = {
    default: "bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]",
    glass: "bg-zinc-900/40 text-zinc-100 border border-zinc-700/50 backdrop-blur-md hover:bg-zinc-800/60 hover:border-cyan-500/50 hover:text-cyan-400",
    outline: "border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500",
  };

  const sizes = {
    default: "h-11 px-5 py-2.5",
    sm: "h-9 px-3 text-xs",
    lg: "h-12 px-8 text-base",
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };