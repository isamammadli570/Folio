import {forwardRef, useState, type ComponentProps} from "react";
import {Eye, EyeOff} from "lucide-react";
import {useTranslation} from "react-i18next";
import {FormField} from "@/components/form/FormField";
import {Input} from "@/components/ui/input";

type FormPasswordProps = Omit<ComponentProps<typeof Input>, "type"> & {
    label: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
};

/** A password field with a button that shows what was typed. */
export const FormPassword = forwardRef<HTMLInputElement, FormPasswordProps>(function FormPassword(
    {label, error, hint, required, containerClassName, ...inputProps},
    ref,
) {
    const {t} = useTranslation("account");
    const [visible, setVisible] = useState(false);
    return (
        <FormField label={label} required={required} error={error} hint={hint} className={containerClassName}>
            <div className="relative">
                <Input ref={ref} type={visible ? "text" : "password"} className="pr-11" aria-invalid={Boolean(error) || undefined} {...inputProps}/>
                <button
                    type="button"
                    onClick={() => setVisible((value) => !value)}
                    aria-label={t(visible ? "auth.hidePassword" : "auth.showPassword")}
                    aria-pressed={visible}
                    className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-accent-bright [&_svg]:size-4 [&_svg]:stroke-[1.5]"
                >
                    {visible ? <EyeOff/> : <Eye/>}
                </button>
            </div>
        </FormField>
    );
});
