import type {ReactNode} from "react";
import {Link} from "react-router";
import {LayoutDashboard, LogIn, LogOut, MapPin, Moon, Package, Sun, UserPlus, UserRound} from "lucide-react";
import {useTranslation} from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ROUTES} from "@/constants/routes";
import {useSignOut} from "@/hooks/account";
import {useIsAdmin} from "@/hooks/admin";
import {useAuth} from "@/hooks/useAuth";
import {useLanguage} from "@/hooks/useLanguage";
import {originOf, useTheme} from "@/hooks/useTheme";
import {SUPPORTED_LANGUAGES} from "@/i18n/resources";
import {preloadRoute} from "@/router/preload";
import {cn} from "@/lib/utils";
import {userIdentity} from "@/helpers/user";
import {UserAvatar} from "@/widgets/UserAvatar";

type AccountMenuProps = {
    /** The header's round icon-button classes, so the trigger matches its neighbours. */
    buttonClassName: string;
};

/**
 * Everything personal in one place: the account pages (or signing in), the admin panel for admins, the theme, the
 * language and signing out. Keeps the header down to search, favourites, cart and this.
 */
export const AccountMenu = ({buttonClassName}: AccountMenuProps) => {
    const {t, i18n} = useTranslation(["common", "account", "admin"]);
    const {language} = useLanguage();
    const {user} = useAuth();
    const {isAdmin} = useIsAdmin();
    const {theme, toggle} = useTheme();
    const signOut = useSignOut();

    const identity = userIdentity(user);
    const {name, email} = identity;
    const isDark = theme === "dark";
    const link = (to: string, icon: ReactNode, label: string, className?: string) => (
        <DropdownMenuItem asChild className={className}>
            <Link to={to} onPointerEnter={() => preloadRoute(to)}>{icon}{label}</Link>
        </DropdownMenuItem>
    );

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button type="button" aria-label={t(user ? "header.account" : "header.signIn")} className={cn(buttonClassName, user && "border-accent/60 data-[state=open]:border-accent data-[state=open]:bg-accent-soft")}>
                    {user ? <UserAvatar identity={identity} className="size-full border-0 text-[15px]"/> : <UserRound/>}
                    {user && <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-accent"/>}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={10} className="w-72 p-0">
                {user && (
                    <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                        <UserAvatar identity={identity} className="size-10 text-base"/>
                        <span className="min-w-0">
                            <span className="block truncate font-serif text-[17px] leading-tight">{name || t("account:nav.reader")}</span>
                            <span className="block truncate text-xs text-muted-foreground">{email}</span>
                        </span>
                    </div>
                )}

                <div className="p-1">
                    {user ? (
                        <>
                            {link(ROUTES.ACCOUNT, <Package/>, t("account:nav.orders"))}
                            {link(ROUTES.ACCOUNT_ADDRESSES, <MapPin/>, t("account:nav.addresses"))}
                            {link(ROUTES.ACCOUNT_PROFILE, <UserRound/>, t("account:nav.profile"))}
                            {isAdmin && link(ROUTES.ADMIN, <LayoutDashboard/>, t("admin:nav.panel"), "mt-1 bg-accent-soft/60 font-medium text-accent-bright [&_svg]:text-accent-bright data-[highlighted]:bg-accent-soft")}
                        </>
                    ) : (
                        <>
                            {link(ROUTES.LOGIN, <LogIn/>, t("account:auth.login.submit"))}
                            {link(ROUTES.REGISTER, <UserPlus/>, t("account:auth.register.submit"))}
                        </>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0"/>

                <div className="p-1">
                    <DropdownMenuItem onSelect={(event) => { event.preventDefault(); toggle(originOf(event.currentTarget as Element)); }}>
                        {isDark ? <Sun/> : <Moon/>}
                        <span className="flex-1">{t(isDark ? "header.lightTheme" : "header.darkTheme")}</span>
                        <span aria-hidden className={cn("relative h-5 w-9 rounded-full border transition-colors duration-300", isDark ? "border-border-strong bg-muted" : "border-accent bg-accent")}>
                            <span className={cn("absolute top-0.5 size-3.5 rounded-full bg-foreground transition-[left,background-color] duration-300", isDark ? "left-0.5" : "left-[1.125rem] bg-accent-ink")}/>
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuLabel className="pb-1 pt-2">{t("header.chooseLanguage")}</DropdownMenuLabel>
                    <div className="flex gap-1 px-1.5 pb-1.5" role="group" aria-label={t("header.chooseLanguage")}>
                        {SUPPORTED_LANGUAGES.map((code) => (
                            <DropdownMenuItem
                                key={code}
                                onSelect={(event) => {
                                    event.preventDefault();
                                    void i18n.changeLanguage(code);
                                }}
                                aria-checked={language === code}
                                role="menuitemradio"
                                className={cn("flex-1 justify-center py-1.5 text-[13px] font-medium uppercase tracking-wider", language === code ? "bg-accent-soft text-accent-bright data-[highlighted]:bg-accent-soft" : "text-muted-foreground")}
                            >
                                {code}
                            </DropdownMenuItem>
                        ))}
                    </div>
                </div>

                {user && (
                    <>
                        <DropdownMenuSeparator className="m-0"/>
                        <div className="p-1">
                            <DropdownMenuItem destructive disabled={signOut.isPending} onSelect={() => signOut.mutate()}><LogOut/>{t("account:nav.signOut")}</DropdownMenuItem>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
