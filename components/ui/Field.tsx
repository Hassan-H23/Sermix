import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

// Shared input chrome — cream surface, near-black ink, accent focus ring.
// Industrial feel: no rounded corners beyond 2px, no glassmorphism, no glow.
const fieldBase =
  "block w-full rounded-[2px] border border-border bg-surface px-4 text-base text-fg placeholder:text-fg-subtle transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50";

const fieldHeight = "h-12";

// ─── Label ───────────────────────────────────────────────────────────────────
type LabelProps = {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
};

export function Label({ htmlFor, children, required, optional }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle"
    >
      {children}
      {required && (
        <span className="ms-1 text-accent" aria-hidden>
          *
        </span>
      )}
      {optional && (
        <span className="ms-1 text-fg-subtle" aria-hidden>
          ·
        </span>
      )}
    </label>
  );
}

// ─── FieldError ──────────────────────────────────────────────────────────────
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className="mt-2 text-sm text-accent"
    >
      {message}
    </p>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, fieldHeight, invalid && "border-accent", className)}
      aria-invalid={invalid}
      {...props}
    />
  ),
);
Input.displayName = "Input";

// ─── Textarea ────────────────────────────────────────────────────────────────
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(fieldBase, "py-3", invalid && "border-accent", className)}
      aria-invalid={invalid}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

// ─── Select ──────────────────────────────────────────────────────────────────
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          fieldBase,
          fieldHeight,
          "appearance-none pe-10",
          invalid && "border-accent",
          className,
        )}
        aria-invalid={invalid}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-fg-subtle"
      >
        ▾
      </span>
    </div>
  ),
);
Select.displayName = "Select";
