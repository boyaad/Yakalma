import Button from "../ui/Button";

const heroImage =
  "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHJpY2UlMjBmaXNofGVufDF8fHx8MTc4MDQ0MDcyMnww&ixlib=rb-4.1.0&q=80&w=1080";

export function InfoBanner({ icon: Icon, children }) {
  return (
    <div className="bg-white border-b border-border-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
          <span>{children}</span>
        </div>
      </div>
    </div>
  );
}

export function InfoHero({ eyebrow, title, description, badge }) {
  return (
    <section className="relative overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl animate-slide-up">
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-amber-300">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight text-white mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-lg sm:text-xl leading-relaxed text-white/90 max-w-2xl">
              {description}
            </p>
          )}
          {badge && (
            <div className="mt-8 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-primary shadow-lg backdrop-blur-sm">
              {badge}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function InfoSection({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`py-14 sm:py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || description) && (
          <div className="max-w-3xl mb-10">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function InfoCta({ icon: Icon, title, description, buttonLabel, to, href }) {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-[#b85420] to-accent">
      <div className="max-w-4xl mx-auto text-center text-white">
        {Icon && <Icon className="w-12 h-12 mx-auto mb-5" aria-hidden="true" />}
        <h2 className="text-3xl sm:text-4xl mb-4">{title}</h2>
        {description && (
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <Button to={to} href={href} variant="white" className="px-8 py-4">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
