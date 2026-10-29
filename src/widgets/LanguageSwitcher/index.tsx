import {Languages} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {LANGUAGE_LABELS, SUPPORTED_LANGUAGES, isLanguage} from "@/i18n/resources";
import {useLanguage} from "@/hooks/useLanguage";
import {cn} from "@/lib/utils";

type LanguageSwitcherProps = {
    className?: string;
};

export const LanguageSwitcher = ({className}: LanguageSwitcherProps) => {
    const {t, i18n} = useTranslation();
    const {language} = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label={t("header.chooseLanguage")} className={cn("gap-1.5 rounded-full uppercase tracking-wider", className)}>
                    <Languages className="stroke-[1.5]"/>
                    {language}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={language} onValueChange={(value) => isLanguage(value) && void i18n.changeLanguage(value)}>
                    {SUPPORTED_LANGUAGES.map((item) => (
                        <DropdownMenuRadioItem key={item} value={item} lang={item}>{LANGUAGE_LABELS[item]}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
