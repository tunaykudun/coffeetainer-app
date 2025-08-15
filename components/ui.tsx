import * as React from "react"

const Badge = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${className}`}
      {...props}
      ref={ref}
    />
  ),
)
Badge.displayName = "Badge"

const Button = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-transform duration-150 active:scale-95 ${className}`}
      {...props}
      ref={ref}
    />
  ),
)
Button.displayName = "Button"

const Card = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} ref={ref} />
  ),
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} ref={ref} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<React.ElementRef<"p">, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p className={`text-2xl leading-none tracking-tight font-extrabold ${className}`} {...props} ref={ref} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<React.ElementRef<"p">, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => <p className={`text-sm text-muted-foreground ${className}`} {...props} ref={ref} />,
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div className={`p-6 pt-0 ${className}`} {...props} ref={ref} />,
)
CardContent.displayName = "CardContent"

const Input = React.forwardRef<React.ElementRef<"input">, React.ComponentPropsWithoutRef<"input">>(
  ({ className, ...props }, ref) => (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
      ref={ref}
    />
  ),
)
Input.displayName = "Input"

const Separator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={`h-px w-full bg-white/10 ${className}`} {...props} />,
)
Separator.displayName = "Separator"

function cn(...args: (string | undefined | false)[]) {
  return args.filter(Boolean).join(" ")
}

export { Badge, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Separator }
