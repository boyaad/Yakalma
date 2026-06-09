/**
 * Input  —  text, number, textarea, select
 *
 * Props:
 *  as         : "input" | "textarea" | "select"  (default: "input")
 *  touched    : bool  — was the field interacted with?
 *  error      : string — validation error message
 *  className  : extra classes forwarded to the element
 *  ...props   : forwarded to the underlying element
 */
export function Input({
  as: Tag = "input",
  touched = false,
  error = "",
  className = "",
  children,
  ...props
}) {
  const base =
    "w-full px-4 py-3.5 bg-white rounded-xl transition-all focus:outline-none";

  const stateClass = touched
    ? error
      ? "focus:ring-4 focus:ring-red-500/10"
      : "focus:ring-4 focus:ring-green-500/10"
    : "focus:ring-4 focus:ring-primary/10";

  const extraClass = Tag === "textarea" ? "resize-none" : "";

  return (
    <Tag
      className={`${base} ${stateClass} ${extraClass} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
