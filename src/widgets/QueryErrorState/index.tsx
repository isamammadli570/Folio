import {AlertCircle, RotateCw} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";

type QueryErrorStateProps = {
    message?: string;
    onRetry?: () => void;
};

export const QueryErrorState = ({message, onRetry}: QueryErrorStateProps) => {
    const {t} = useTranslation();

    return (
        <div role="alert" className="animate-fade-in flex flex-col items-center gap-3 border border-dashed border-border-strong px-6 py-14 text-center">
            <AlertCircle className="size-6 text-danger" aria-hidden/>
            <p className="max-w-md text-sm text-muted-foreground">{message || t("errors.load")}</p>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                    <RotateCw/>
                    {t("actions.retry")}
                </Button>
            )}
        </div>
    );
};
