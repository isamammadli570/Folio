import type {Author, BookWithAuthor} from "@/api/types";
import {discountPercent, filterBooks, isInPeriod, matchesQuery, normalizeSearch, sortBooks, stockLevel} from "@/helpers/catalog";
import {l} from "@/data/localized";

const author: Author = {
    id: "nietzsche", born: 1844, died: 1900,
    name: l("Fridrix Nitsşe", "Friedrich Nietzsche", "Фридрих Ницше"),
    movement: l("", "", ""), bio: l("", "", ""),
};

const book = (overrides: Partial<BookWithAuthor>): BookWithAuthor => ({
    id: "b", authorId: author.id, author, category: "philosophy",
    title: l("Zərdüşt belə deyirdi", "Thus Spoke Zarathustra", "Так говорил Заратустра"),
    description: l("", "", ""), price: 10, stock: 5, pages: 100, year: 1883, ornament: "star",
    ...overrides,
});

describe("normalizeSearch", () => {
    it("folds Azerbaijani letters and accents", () => {
        expect(normalizeSearch("  NİTSŞE ")).toBe("nitsse");
        expect(normalizeSearch("Ərəb")).toBe("ereb");
        expect(normalizeSearch("Qırx")).toBe("qirx");
    });
});

describe("matchesQuery", () => {
    it("finds a book by its title or author in any language", () => {
        expect(matchesQuery(book({}), "zerdust")).toBe(true);
        expect(matchesQuery(book({}), "nietzsche zarathustra")).toBe(true);
        expect(matchesQuery(book({}), "ницше")).toBe(true);
        expect(matchesQuery(book({}), "kafka")).toBe(false);
    });
});

describe("filterBooks", () => {
    const books = [
        book({id: "a", price: 8, stock: 0, year: -375, category: "history"}),
        book({id: "b", price: 20, stock: 3, year: 1883}),
        book({id: "c", price: 30, stock: 9, year: 1942, category: "literature"}),
    ];

    it("combines category, price, stock and period", () => {
        expect(filterBooks(books, {category: "philosophy"}).map((b) => b.id)).toEqual(["b"]);
        expect(filterBooks(books, {minPrice: 10, maxPrice: 25}).map((b) => b.id)).toEqual(["b"]);
        expect(filterBooks(books, {inStockOnly: true}).map((b) => b.id)).toEqual(["b", "c"]);
        expect(filterBooks(books, {period: "ancient"}).map((b) => b.id)).toEqual(["a"]);
    });

    it("matches any of several periods or sections", () => {
        expect(filterBooks(books, {periods: ["ancient", "contemporary"]}).map((b) => b.id)).toEqual(["a", "c"]);
        expect(filterBooks(books, {categories: ["philosophy", "literature"]}).map((b) => b.id)).toEqual(["b", "c"]);
        expect(filterBooks(books, {periods: [], categories: []}).map((b) => b.id)).toEqual(["a", "b", "c"]);
    });
});

describe("isInPeriod", () => {
    it("places BCE years in antiquity", () => {
        expect(isInPeriod(-427, "ancient")).toBe(true);
        expect(isInPeriod(1500, "modern")).toBe(true);
        expect(isInPeriod(1900, "contemporary")).toBe(true);
    });
});

describe("sortBooks", () => {
    const books = [
        book({id: "a", price: 30, year: 1900, title: l("Yad", "The Stranger", "Посторонний")}),
        book({id: "b", price: 10, year: -400, tag: "bestseller", title: l("Ədalət", "Justice", "Справедливость")}),
        book({id: "c", price: 20, year: 1600, tag: "new", title: l("Aya", "Ark", "Арка")}),
    ];

    it("sorts by price, age, title and featured weight", () => {
        expect(sortBooks(books, "price-asc", "az").map((b) => b.id)).toEqual(["b", "c", "a"]);
        expect(sortBooks(books, "oldest", "az").map((b) => b.id)).toEqual(["b", "c", "a"]);
        expect(sortBooks(books, "title", "az").map((b) => b.id)).toEqual(["c", "b", "a"]);
        expect(sortBooks(books, "featured", "az").map((b) => b.id)).toEqual(["b", "c", "a"]);
    });

    it("does not mutate its input", () => {
        sortBooks(books, "price-desc", "en");
        expect(books.map((b) => b.id)).toEqual(["a", "b", "c"]);
    });
});

describe("discountPercent and stockLevel", () => {
    it("rounds the saving and grades stock", () => {
        expect(discountPercent({price: 24.5, oldPrice: 29})).toBe(16);
        expect(discountPercent({price: 10})).toBeNull();
        expect(stockLevel(0)).toBe("out");
        expect(stockLevel(4)).toBe("low");
        expect(stockLevel(12)).toBe("in");
    });
});
