import {useTranslation} from "react-i18next";
import {Sidebar} from "@/layout/StoreLayout/Sidebar";
import {Sheet} from "@/widgets/Sheet";

type MenuSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenSearch: () => void;
};

/** The slide-out menu for phones and tablets. Its own chunk: StoreLayout loads it when the page is idle. */
export const MenuSheet = ({open, onOpenChange, onOpenSearch}: MenuSheetProps) => {
    const {t} = useTranslation();
    return (
        <Sheet open={open} onOpenChange={onOpenChange} title={t("header.openMenu")} side="left">
            <Sidebar onNavigate={() => onOpenChange(false)} onOpenSearch={onOpenSearch}/>
        </Sheet>
    );
};
