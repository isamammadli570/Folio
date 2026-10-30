import type {Page} from "@playwright/test";
import {expect, test} from "./fixtures";

/** Adds the book on the page and waits for the header count; a guest's first add opens the sign-in nudge, which is closed. */
const addToCart = async (page: Page, count: string) => {
    await page.getByRole("button", {name: "Add to cart"}).first().click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", {name: "Cart", exact: true})).toContainText(count);
};

test("home page shows the shelves and leads to the catalogue", async ({page}) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Folio/);
    await page.getByRole("navigation", {name: "Books"}).getByRole("link", {name: "Books"}).first().click();
    await expect(page).toHaveURL(/\/books$/);
    await expect(page.locator('a[href^="/books/"]').first()).toBeVisible();
});

test("a category filter narrows the catalogue and lands in the URL", async ({page}) => {
    await page.goto("/books?category=philosophy");
    await expect(page.locator('a[href="/books/the-republic"]').first()).toBeVisible();
    await expect(page.locator('a[href="/books/crime-and-punishment"]')).toHaveCount(0);
});

test("a book page names the book and its author in the title", async ({page}) => {
    await page.goto("/books/crime-and-punishment");
    await expect(page.getByRole("heading", {level: 1})).toContainText("Crime and Punishment");
    await expect(page).toHaveTitle(/Crime and Punishment · .*Dostoevsky/);
});

test("adding a book fills the cart and the drawer can change the quantity", async ({page}) => {
    await page.goto("/books/symposium");
    await addToCart(page, "1");
    const cart = page.getByRole("button", {name: "Cart", exact: true});

    await cart.click();
    await page.getByRole("button", {name: "Increase"}).first().click();
    // The drawer is modal, so the header count is hidden behind it; the stored cart tells the truth.
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("folio.cart") ?? "[]") as unknown)).toEqual([{bookId: "symposium", quantity: 2}]);
});

test("checkout asks for the contact details before going on", async ({page}) => {
    await page.goto("/books/apology");
    await addToCart(page, "1");
    await page.goto("/checkout");
    await page.getByRole("button", {name: "Continue as a guest"}).click();
    await page.getByRole("button", {name: /Next|Continue/}).last().click();
    await expect(page.getByText("Fill in this field").first()).toBeVisible();
});

test("the language switch changes the interface", async ({page}) => {
    await page.goto("/");
    await page.getByRole("button", {name: "Sign in"}).click();
    await page.getByRole("menuitemradio", {name: "ru"}).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.getByRole("button", {name: "Корзина"})).toBeVisible();
});

test("the theme toggle switches between dark and light", async ({page}) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
    await page.getByRole("button", {name: "Sign in"}).click();
    await page.getByRole("menuitem", {name: "Light theme"}).click();
    await expect(html).not.toHaveClass(/dark/);
});

test("terms and privacy pages render, and unknown pages say so", async ({page}) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", {level: 1})).toHaveText("Terms of use");
    await page.goto("/privacy");
    await expect(page.getByRole("heading", {level: 1})).toHaveText("Privacy policy");
    await page.goto("/no-such-page");
    await expect(page.getByText("This page wasn't found")).toBeVisible();
});

test("guests are sent from the account to sign in", async ({page}) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
});
