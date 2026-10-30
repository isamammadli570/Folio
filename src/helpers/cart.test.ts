import {addLine, cartTotals, countItems, isCartLines, setLineQuantity, applyDiscount} from "@/helpers/cart";

describe("cart lines", () => {
    it("adds new books on top and caps at stock", () => {
        const one = addLine([], "a", 1, 5);
        const two = addLine(one, "b", 2, 5);
        expect(two.map((line) => line.bookId)).toEqual(["b", "a"]);
        expect(addLine(two, "a", 10, 3).find((line) => line.bookId === "a")?.quantity).toBe(3);
        expect(addLine([], "x", 1, 0)).toEqual([]);
    });

    it("removes a line at zero and counts copies", () => {
        const lines = [{bookId: "a", quantity: 2}, {bookId: "b", quantity: 1}];
        expect(setLineQuantity(lines, "a", 0)).toEqual([{bookId: "b", quantity: 1}]);
        expect(countItems(lines)).toBe(3);
    });

    it("rejects malformed stored data", () => {
        expect(isCartLines([{bookId: "a", quantity: 1}])).toBe(true);
        expect(isCartLines([{bookId: "a", quantity: 0}])).toBe(false);
        expect(isCartLines("nope")).toBe(false);
    });
});

describe("cartTotals", () => {
    const books = [{id: "a", price: 18.9}, {id: "b", price: 0.1}, {id: "c", price: 0.2}];

    it("charges delivery below 40 ₼ and drops it above", () => {
        expect(cartTotals([{bookId: "a", quantity: 1}], books)).toEqual({subtotal: 18.9, shipping: 4, total: 22.9, toFreeShipping: 21.1});
        expect(cartTotals([{bookId: "a", quantity: 3}], books)).toMatchObject({subtotal: 56.7, shipping: 0, total: 56.7, toFreeShipping: 0});
    });

    it("sums without floating point drift", () => {
        expect(cartTotals([{bookId: "b", quantity: 1}, {bookId: "c", quantity: 1}], books).subtotal).toBe(0.3);
    });

    it("is free for an empty cart", () => {
        expect(cartTotals([], books)).toEqual({subtotal: 0, shipping: 0, total: 0, toFreeShipping: 40});
    });
});

describe("applyDiscount", () => {
    it("takes the percentage off the books only, to the qəpik", () => {
        const totals = {subtotal: 33.3, shipping: 4, total: 37.3, toFreeShipping: 6.7};
        expect(applyDiscount(totals, 10)).toMatchObject({discount: 3.33, total: 33.97, percent: 10});
        expect(applyDiscount(totals, 0)).toMatchObject({discount: 0, total: 37.3});
    });
});
