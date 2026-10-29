import {useId, type ReactElement, type ReactNode} from "react";
import {cloneElement} from "react";
import {cn} from "@/lib/utils";

type FormFieldProps = {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    className?: string;
    /** A single control; it receives the generated `id` and the `aria-invalid` flag. */
    children: ReactElement<{id?: string; "aria-invalid"?: boolean}> | ReactNode;
};

export function FormField({label, required, error, hint, className, children}: FormFieldProps) {
    const id = useId();
    const control =
        children && typeof children === "object" && "props" in (children as ReactElement)
            ? cloneElement(children as ReactElement<{id?: string; "aria-invalid"?: boolean}>, {
                id,
                "aria-invalid": Boolean(error) || undefined,
            })
            : children;

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label htmlFor={id} className="text-[13px] font-medium text-foreground">
                {label}
                {required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}
            </label>
            {control}
            {error ? (
                <p role="alert" className="animate-fade-in text-xs text-danger">{error}</p>
            ) : hint ? (
                <p className="text-xs text-muted-foreground">{hint}</p>
            ) : null}
        </div>
    );
}
