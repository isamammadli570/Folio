import {describe, expect, it} from "vitest";
import {formatDate, formatDay} from "@/helpers/format";

describe("formatDate", () => {
    it("spells Azerbaijani months itself instead of the browser's M10", () => {
        expect(formatDate(new Date(2026, 9, 29), "az")).toBe("29 oktyabr 2026");
        expect(formatDay(new Date(2026, 0, 3), "az")).toBe("3 yan");
    });

    it("uses the browser's calendar for English", () => {
        expect(formatDate(new Date(2026, 9, 29), "en")).toBe("29 October 2026");
    });
});
