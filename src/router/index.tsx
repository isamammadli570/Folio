import {createBrowserRouter, type RouteObject} from "react-router";
import {StoreLayout} from "@/layout/StoreLayout";
import {RouteErrorPage} from "@/router/RouteErrorPage";
import {pageRoute} from "@/router/preload";
import {ROUTES} from "@/constants/routes";
import {Loading} from "@/widgets/Loading";

const storeRoutes: RouteObject[] = [
    pageRoute(ROUTES.HOME, () => import("@/pages/HomePage"), "HomePage"),
    pageRoute(ROUTES.CATALOG, () => import("@/pages/CatalogPage"), "CatalogPage"),
    pageRoute(ROUTES.BOOK, () => import("@/pages/BookPage"), "BookPage"),
    pageRoute(ROUTES.AUTHORS, () => import("@/pages/AuthorsPage"), "AuthorsPage"),
    pageRoute(ROUTES.AUTHOR, () => import("@/pages/AuthorPage"), "AuthorPage"),
    pageRoute(ROUTES.FAVORITES, () => import("@/pages/FavoritesPage"), "FavoritesPage"),
    pageRoute(ROUTES.CHECKOUT, () => import("@/pages/CheckoutPage"), "CheckoutPage"),
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
