import {describe, expect, it} from "vitest";
import {mergeCartLines, mergeIds, sameCart} from "@/helpers/shelf";

describe("mergeCartLines", () => {
    it("keeps local order, takes the larger quantity and appends saved-only lines", () => {
        const local = [{bookId: "a", quantity: 1}, {bookId: "b", quantity: 3}];
        const saved = [{bookId: "b", quantity: 2}, {bookId: "a", quantity: 4}, {bookId: "c", quantity: 1}];
        expect(mergeCartLines(local, saved)).toEqual([{bookId: "a", quantity: 4}, {bookId: "b", quantity: 3}, {bookId: "c", quantity: 1}]);
    });

    it("returns the saved cart when this device has none", () => {
        expect(mergeCartLines([], [{bookId: "a", quantity: 2}])).toEqual([{bookId: "a", quantity: 2}]);
    });
});

describe("mergeIds", () => {
    it("puts local ids first without duplicates", () => {
        expect(mergeIds(["b", "a"], ["a", "c"])).toEqual(["b", "a", "c"]);
    });
});

describe("sameCart", () => {
    it("compares lines in order", () => {
        expect(sameCart([{bookId: "a", quantity: 1}], [{bookId: "a", quantity: 1}])).toBe(true);
        expect(sameCart([{bookId: "a", quantity: 1}], [{bookId: "a", quantity: 2}])).toBe(false);
    });
});
