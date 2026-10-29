import {timelinePosition} from "@/helpers/timeline";

describe("timelinePosition", () => {
    it("gives each period a quarter", () => {
        expect(timelinePosition(-800)).toBe(0);
        expect(timelinePosition(500)).toBe(25);
        expect(timelinePosition(1500)).toBe(50);
        expect(timelinePosition(1900)).toBe(75);
        expect(timelinePosition(2000)).toBe(100);
    });

    it("interpolates inside a period and clamps outside the range", () => {
        expect(timelinePosition(1000)).toBeCloseTo(37.5);
        expect(timelinePosition(1950)).toBeCloseTo(87.5);
        expect(timelinePosition(-2000)).toBe(0);
        expect(timelinePosition(2100)).toBe(100);
    });
});
