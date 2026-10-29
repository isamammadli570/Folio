import {forwardRef, type ComponentProps} from "react";
import {FormField} from "@/components/form/FormField";
import {Textarea} from "@/components/ui/textarea";

type FormTextareaProps = ComponentProps<typeof Textarea> & {
    label: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(function FormTextarea(
    {label, error, hint, required, containerClassName, ...textareaProps},
    ref,
) {
    return (
        <FormField label={label} required={required} error={error} hint={hint} className={containerClassName}>
            <Textarea ref={ref} {...textareaProps}/>
        </FormField>
    );
});
