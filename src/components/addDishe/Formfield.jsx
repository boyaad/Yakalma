import { XCircle } from "lucide-react";
import { Input } from "./Input";

/**
 * FormField  —  label + input/textarea/select + inline error
 *
 * Props:
 *  label      : string
 *  required   : bool
 *  as         : forwarded to <Input> ("input" | "textarea" | "select")
 *  touched    : bool
 *  error      : string
 *  hint       : node  — optional hint rendered below the field (e.g. char count)
 *  children   : forwarded to <Input> (used for <select> options)
 *  ...props   : forwarded to <Input>
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
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input
        as={as}
        id={id}
        touched={touched}
        error={error}
        {...props}
      >
        {children}
      </Input>
      <div className="flex items-center justify-between mt-2">
        {touched && error ? (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        ) : (
          hint && <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}
