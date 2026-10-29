import {forwardRef, type ComponentProps} from "react";
import {FormField} from "@/components/form/FormField";
import {Input} from "@/components/ui/input";

type FormInputProps = ComponentProps<typeof Input> & {
    label: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
    {label, error, hint, required, containerClassName, ...inputProps},
    ref,
) {
    return (
        <FormField label={label} required={required} error={error} hint={hint} className={containerClassName}>
            <Input ref={ref} {...inputProps}/>
        </FormField>
    );
});
