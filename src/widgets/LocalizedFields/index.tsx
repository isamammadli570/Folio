import type {FieldErrors, FieldValues, Path, UseFormRegister} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {FormField} from "@/components/form/FormField";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {SUPPORTED_LANGUAGES} from "@/i18n/resources";
import {cn} from "@/lib/utils";

type LocalizedFieldsProps<TForm extends FieldValues> = {
    /** The form field holding {az, en, ru}, e.g. "title". */
    name: string;
    label: string;
    register: UseFormRegister<TForm>;
    errors: FieldErrors<TForm>;
    multiline?: boolean;
    required?: boolean;
    className?: string;
};

/** One text in all three site languages, side by side on wide screens: AZ, EN, RU. */
export const LocalizedFields = <TForm extends FieldValues>({name, label, register, errors, multiline = false, required = true, className}: LocalizedFieldsProps<TForm>) => {
    const {t} = useTranslation("admin");
    const fieldErrors = errors[name] as Partial<Record<string, {message?: string}>> | undefined;

    return (
        <fieldset className={cn("min-w-0", className)}>
            <legend className="mb-2 text-[13px] font-medium">{label}{required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}</legend>
            <div className={cn("grid gap-3", multiline ? "lg:grid-cols-3" : "sm:grid-cols-3")}>
                {SUPPORTED_LANGUAGES.map((language) => {
                    const path = `${name}.${language}` as Path<TForm>;
                    const rules = required ? {validate: (value: string) => value.trim().length > 0 || t("form.required")} : {};
                    const control = multiline
                        ? <Textarea rows={5} lang={language} {...register(path, rules)}/>
                        : <Input lang={language} {...register(path, rules)}/>;
                    return (
                        <FormField key={language} label={language.toUpperCase()} error={fieldErrors?.[language]?.message}>
                            {control}
                        </FormField>
                    );
                })}
            </div>
        </fieldset>
    );
};
