import {describe, expect, it} from "vitest";
import type {BookRow} from "@/api/rows";
import {mapBookRow} from "@/helpers/rows";

const row: BookRow = {
    id: "republic", author_id: "plato", category: "philosophy",
    title: {az: "Dövlət", en: "The Republic", ru: "Государство"}, description: {az: "", en: "", ru: ""},
    price: "18.50", old_price: null, stock: 4, pages: 416, year: -375, approx_year: true,
    ornament: "column", tag: null, cover_image: null, position: 0,
};

describe("mapBookRow", () => {
    it("turns numeric strings into numbers and drops null columns", () => {
        const book = mapBookRow(row);
        expect(book.price).toBe(18.5);
        expect(book).not.toHaveProperty("oldPrice");
        expect(book).not.toHaveProperty("tag");
        expect(book.approxYear).toBe(true);
    });

    it("falls back for an unknown category or ornament", () => {
        const book = mapBookRow({...row, category: "poetry", ornament: "dragon", old_price: 22, tag: "new"});
        expect(book.category).toBe("philosophy");
        expect(book.ornament).toBe("column");
        expect(book.oldPrice).toBe(22);
        expect(book.tag).toBe("new");
    });
});
