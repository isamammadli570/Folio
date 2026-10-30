import {test as base, expect} from "@playwright/test";

/** Every test starts in English with an empty browser, so labels are predictable. */
export const test = base.extend({
    page: async ({page}, provide) => {
        await page.addInitScript(() => {
            if (!sessionStorage.getItem("e2e.ready")) {
                localStorage.clear();
                localStorage.setItem("lang", "en");
                sessionStorage.setItem("e2e.ready", "1");
            }
        });
        await provide(page);
    },
});

export {expect};
