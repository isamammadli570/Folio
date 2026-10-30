import {describe, expect, it} from "vitest";
import type {Order} from "@/api/types";
import {orderStats, salesByDay, slugify, toBookRow} from "@/helpers/admin";

const order = (overrides: Partial<Order>): Order => ({
    id: "o", number: "FL-1", status: "new", firstName: "", lastName: "", email: "", phone: "", deliveryMethod: "pickup",
    city: "", address: "", note: "", paymentMethod: "cash", subtotal: 0, shipping: 0, total: 10, discount: 0, promoCode: "", createdAt: "2026-10-30T10:00:00", items: [],
    ...overrides,
});

describe("slugify", () => {
    it("folds Azerbaijani letters and punctuation", () => {
        expect(slugify("Cinayət və cəza!")).toBe("cinayet-ve-ceza");
        expect(slugify("  The Brothers Karamazov ")).toBe("the-brothers-karamazov");
        expect(slugify("Şərq ığdırı")).toBe("serq-igdiri");
    });
});

describe("toBookRow", () => {
    it("writes missing optional fields as null so an edit can clear them", () => {
        const row = toBookRow({
            id: "x", authorId: "a", category: "history", title: {az: "", en: "", ru: ""}, description: {az: "", en: "", ru: ""},
            price: 10, stock: 1, pages: 100, year: 1900, ornament: "sun",
        }, 3);
        expect(row).toMatchObject({old_price: null, tag: null, cover_image: null, approx_year: false, position: 3});
    });
});

describe("orderStats", () => {
    it("leaves cancelled orders out of revenue", () => {
        const stats = orderStats([order({total: 20}), order({total: 10.1}), order({total: 99, status: "cancelled"})]);
        expect(stats).toMatchObject({revenue: 30.1, orders: 2, average: 15.05});
        expect(stats.byStatus.cancelled).toBe(1);
    });
});

describe("salesByDay", () => {
    it("buckets orders by local day and fills empty days", () => {
        const days = salesByDay([order({total: 5, createdAt: "2026-10-30T09:00:00"}), order({total: 7, createdAt: "2026-10-28T23:00:00"})], 3, new Date(2026, 9, 30, 12));
        expect(days).toEqual([
            {day: "2026-10-28", total: 7, count: 1},
            {day: "2026-10-29", total: 0, count: 0},
            {day: "2026-10-30", total: 5, count: 1},
        ]);
    });
});
