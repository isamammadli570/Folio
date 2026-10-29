import {createBrowserRouter, type RouteObject} from "react-router";
import {StoreLayout} from "@/layout/StoreLayout";
import {RouteErrorPage} from "@/router/RouteErrorPage";
import {pageRoute} from "@/router/preload";
import {requireGuest, requireUser} from "@/router/guards";
import {ROUTES} from "@/constants/routes";
import {Loading} from "@/widgets/Loading";

// The orders list is the account index; registering it under /account lets hovering an account link warm its chunk.
const ordersRoute = pageRoute(ROUTES.ACCOUNT, () => import("@/pages/OrdersPage"), "OrdersPage");

const accountRoutes: RouteObject[] = [
    {index: true, lazy: ordersRoute.lazy} as RouteObject,
    pageRoute(ROUTES.ACCOUNT_ADDRESSES, () => import("@/pages/AddressesPage"), "AddressesPage"),
    pageRoute(ROUTES.ACCOUNT_PROFILE, () => import("@/pages/ProfilePage"), "ProfilePage"),
];

const storeRoutes: RouteObject[] = [
    pageRoute(ROUTES.HOME, () => import("@/pages/HomePage"), "HomePage"),
    pageRoute(ROUTES.CATALOG, () => import("@/pages/CatalogPage"), "CatalogPage"),
    pageRoute(ROUTES.BOOK, () => import("@/pages/BookPage"), "BookPage"),
    pageRoute(ROUTES.AUTHORS, () => import("@/pages/AuthorsPage"), "AuthorsPage"),
    pageRoute(ROUTES.AUTHOR, () => import("@/pages/AuthorPage"), "AuthorPage"),
    pageRoute(ROUTES.FAVORITES, () => import("@/pages/FavoritesPage"), "FavoritesPage"),
    pageRoute(ROUTES.CHECKOUT, () => import("@/pages/CheckoutPage"), "CheckoutPage"),
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
        id: "store",
        Component: StoreLayout,
        errorElement: <RouteErrorPage/>,
        hydrateFallbackElement: <Loading/>,
        children: storeRoutes.map((route) => ({...route, errorElement: <RouteErrorPage/>})),
    },
]);
