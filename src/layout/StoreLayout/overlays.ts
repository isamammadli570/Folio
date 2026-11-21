import {lazyComponent} from "@/lib/lazy";

// Parts of the storefront shell that no page shows at first. Each is its own chunk: StoreLayout fetches them once the
// page is idle and creates each one the first time it opens, so the first page carries none of their code.
export const AccountMenu = lazyComponent(() => import("@/layout/StoreLayout/AccountMenu").then((module) => module.AccountMenu));
export const MenuSheet = lazyComponent(() => import("@/layout/StoreLayout/MenuSheet").then((module) => module.MenuSheet));
export const SearchDialog = lazyComponent(() => import("@/layout/StoreLayout/SearchDialog").then((module) => module.SearchDialog));
export const CartDrawer = lazyComponent(() => import("@/layout/StoreLayout/CartDrawer").then((module) => module.CartDrawer));
