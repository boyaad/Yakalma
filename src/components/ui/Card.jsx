import React from "react";

export function Card({ children, className = "" }) {
  return (
    <article className={`min-w-0 bg-white rounded-xl border border-border-warm p-4 hover:shadow-md transition-all ${className}`}>
      {children}
    </article>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <header className={`mb-3 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between ${className}`}>
      <div className="min-w-0 flex-1 min-[420px]:pr-4">
        {title && <h3 className="break-words font-bold text-base mb-1 text-foreground">{title}</h3>}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 self-start">{action}</div>}
    </header>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`space-y-3 mb-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <footer className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-warm ${className}`}>
      {children}
    </footer>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
