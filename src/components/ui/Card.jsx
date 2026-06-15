import React from "react";

export function Card({ children, className = "" }) {
  return (
    <article className={`bg-white rounded-xl border border-border-warm p-4 hover:shadow-md transition-all ${className}`}>
      {children}
    </article>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <header className={`flex items-start justify-between mb-3 ${className}`}>
      <div className="flex-1 pr-4">
        {title && <h3 className="font-bold text-base mb-1 text-foreground">{title}</h3>}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`space-y-3 mb-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <footer className={`flex items-center justify-between pt-3 border-t border-border-warm ${className}`}>
      {children}
    </footer>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
