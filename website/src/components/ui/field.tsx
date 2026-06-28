import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

const baseField =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-primary aria-[invalid=true]:ring-primary/30";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseField, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(baseField, "min-h-28 resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className={cn(baseField, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  </div>
));
Select.displayName = "Select";

/**
 * Field wraps a single labelled control. It auto-generates an id and wires
 * up htmlFor + aria-describedby/aria-invalid on the child control, so labels,
 * helper text, and errors are all programmatically associated.
 */
export function Field({
  label,
  required,
  children,
  className,
  hint,
  error,
  optional,
}: {
  label: string;
  required?: boolean;
  children: React.ReactElement;
  className?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  const reactId = React.useId();
  const childProps = children.props as { id?: string };
  const id = childProps.id ?? reactId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    required,
  });

  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-primary"> *</span>}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {control}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-primary">
          {error}
        </p>
      )}
    </div>
  );
}
