export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-accent shadow-lg hover:shadow-xl",
    outline: "bg-transparent hover:bg-muted",
    ghost: "bg-transparent hover:bg-muted",
    icon: "bg-primary text-primary-foreground hover:bg-accent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
