import {createBrowserRouter, type RouteObject} from "react-router";
import {StoreLayout} from "@/layout/StoreLayout";
import {RouteErrorPage} from "@/router/RouteErrorPage";
import {pageRoute} from "@/router/preload";
import {requireAdmin, requireGuest, requireUser} from "@/router/guards";
import {ROUTES} from "@/constants/routes";
import {Loading} from "@/widgets/Loading";

// The orders list is the account index; registering it under /account lets hovering an account link warm its chunk.
const ordersRoute = pageRoute(ROUTES.ACCOUNT, () => import("@/pages/OrdersPage"), "OrdersPage");

const accountRoutes: RouteObject[] = [
    {index: true, lazy: ordersRoute.lazy} as RouteObject,
    pageRoute(ROUTES.ACCOUNT_ADDRESSES, () => import("@/pages/AddressesPage"), "AddressesPage"),
    pageRoute(ROUTES.ACCOUNT_PROFILE, () => import("@/pages/ProfilePage"), "ProfilePage"),
];

// The dashboard is the admin index, registered under /admin so hovering its link warms the chunk.
const dashboardRoute = pageRoute(ROUTES.ADMIN, () => import("@/pages/admin/AdminDashboardPage"), "AdminDashboardPage");

const adminRoutes: RouteObject[] = [
    {index: true, lazy: dashboardRoute.lazy} as RouteObject,
    pageRoute(ROUTES.ADMIN_ORDERS, () => import("@/pages/admin/AdminOrdersPage"), "AdminOrdersPage"),
    pageRoute(ROUTES.ADMIN_NEWSLETTER, () => import("@/pages/admin/AdminNewsletterPage"), "AdminNewsletterPage"),
    pageRoute(ROUTES.ADMIN_CUSTOMERS, () => import("@/pages/admin/AdminCustomersPage"), "AdminCustomersPage"),
    pageRoute(ROUTES.ADMIN_PROMOS, () => import("@/pages/admin/AdminPromosPage"), "AdminPromosPage"),
    pageRoute(ROUTES.ADMIN_ALERTS, () => import("@/pages/admin/AdminAlertsPage"), "AdminAlertsPage"),
    pageRoute(ROUTES.ADMIN_BOOKS, () => import("@/pages/admin/AdminBooksPage"), "AdminBooksPage"),
    pageRoute(ROUTES.ADMIN_BOOK, () => import("@/pages/admin/AdminBookPage"), "AdminBookPage"),
    pageRoute(ROUTES.ADMIN_AUTHORS, () => import("@/pages/admin/AdminAuthorsPage"), "AdminAuthorsPage"),
    pageRoute(ROUTES.ADMIN_AUTHOR, () => import("@/pages/admin/AdminAuthorPage"), "AdminAuthorPage"),
];

const storeRoutes: RouteObject[] = [
    pageRoute(ROUTES.HOME, () => import("@/pages/HomePage"), "HomePage"),
    pageRoute(ROUTES.CATALOG, () => import("@/pages/CatalogPage"), "CatalogPage"),
    pageRoute(ROUTES.BOOK, () => import("@/pages/BookPage"), "BookPage"),
    pageRoute(ROUTES.AUTHORS, () => import("@/pages/AuthorsPage"), "AuthorsPage"),
    pageRoute(ROUTES.AUTHOR, () => import("@/pages/AuthorPage"), "AuthorPage"),
    pageRoute(ROUTES.FAVORITES, () => import("@/pages/FavoritesPage"), "FavoritesPage"),
    pageRoute(ROUTES.CHECKOUT, () => import("@/pages/CheckoutPage"), "CheckoutPage"),
    pageRoute(ROUTES.PRIVACY, () => import("@/pages/PrivacyPage"), "PrivacyPage"),
    pageRoute(ROUTES.TERMS, () => import("@/pages/TermsPage"), "TermsPage"),
    pageRoute(ROUTES.LOGIN, () => import("@/pages/LoginPage"), "LoginPage", {loader: requireGuest}),
    pageRoute(ROUTES.REGISTER, () => import("@/pages/RegisterPage"), "RegisterPage", {loader: requireGuest}),
    pageRoute(ROUTES.FORGOT_PASSWORD, () => import("@/pages/ForgotPasswordPage"), "ForgotPasswordPage", {loader: requireGuest}),
    pageRoute(ROUTES.RESET_PASSWORD, () => import("@/pages/ResetPasswordPage"), "ResetPasswordPage"),
    {
        path: ROUTES.ACCOUNT,
        loader: requireUser,
        lazy: async () => ({Component: (await import("@/layout/AccountLayout")).AccountLayout}),
        children: accountRoutes.map((route) => ({...route, errorElement: <RouteErrorPage/>})),
    },
    {path: "*", Component: RouteErrorPage},
];

export const router = createBrowserRouter([
    {
        id: "admin",
        path: ROUTES.ADMIN,
        loader: requireAdmin,
        lazy: async () => ({Component: (await import("@/layout/AdminLayout")).AdminLayout}),
        errorElement: <RouteErrorPage/>,
        hydrateFallbackElement: <Loading/>,
        children: adminRoutes.map((route) => ({...route, errorElement: <RouteErrorPage/>})),
    },
    {
        id: "store",
        Component: StoreLayout,
        errorElement: <RouteErrorPage/>,
        hydrateFallbackElement: <Loading/>,
        children: storeRoutes.map((route) => ({...route, errorElement: <RouteErrorPage/>})),
    },
]);
