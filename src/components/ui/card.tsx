
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Fix the typing for CardTitle to handle both anchor and heading cases
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  href?: string;
  as?: React.ElementType;
}

const CardTitle = React.forwardRef<HTMLElement, CardTitleProps>(
  ({ className, href, as, ...props }, ref) => {
    const Component = href ? 'a' : (as || 'h3');
    return (
      <Component
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          href && "hover:underline hover:text-primary transition-colors cursor-pointer",
          className
        )}
        {...(href ? { href } : {})}
        {...props}
      />
    );
  }
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; itemId?: string }
>(({ className, src, alt, itemId, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-64 overflow-hidden", className)}
    {...props}
  >
    {src ? (
      <img 
        src={src} 
        alt={alt || "Card image"} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        style={itemId ? {viewTransitionName: `food-image-${itemId}`} : undefined}
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image</span>
      </div>
    )}
  </div>
))
CardImage.displayName = "CardImage"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardImage
}
