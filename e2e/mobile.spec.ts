import {expect, test} from "./fixtures";

const PAGES = ["/", "/books", "/books/crime-and-punishment", "/authors", "/checkout", "/terms"];

for (const path of PAGES) {
    test(`${path} fits a phone screen without sideways scrolling`, async ({page}) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(0);
    });
}
