import Input from "../ui/Input";

/**
 * FormField  —  wrapper léger autour de ui/Input
 * Transmet label, required, as, touched, error, hint (helperText) et toutes les props.
 *
 * Props:
 *  label      : string
 *  required   : bool  (affiche * rouge dans le label)
 *  as         : "input" | "textarea" | "select"
 *  touched    : bool
 *  error      : string
 *  hint       : string — texte d'aide sous le champ (alias helperText)
 *  children   : options pour <select>
 *  ...props   : transmis à ui/Input
 */
export function FormField({
  label,
  required = false,
  as,
  touched,
  error,
  hint,
  children,
  id,
  ...props
}) {
  // Construction du label avec indicateur obligatoire
  const labelNode = label ? (
    <span>
      {label} {required && <span className="text-red-500">*</span>}
    </span>
  ) : undefined;

  return (
    <Input
      as={as}
      id={id}
      label={labelNode}
      touched={touched}
      error={error}
      helperText={!error && hint ? hint : undefined}
      {...props}
    >
      {children}
    </Input>
  );
}
