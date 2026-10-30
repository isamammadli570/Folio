import {describe, expect, it} from "vitest";
import {clip, replaceShareBlock, shareTags} from "@/helpers/share";

describe("clip", () => {
    it("keeps whole words and adds an ellipsis", () => {
        expect(clip("one two three four", 9)).toBe("one two…");
        expect(clip("  short  text ")).toBe("short text");
    });
});

describe("shareTags", () => {
    it("escapes quotes and angle brackets", () => {
        const tags = shareTags({title: "\"A\" <B>", description: "x", image: "https://e/i.jpg", url: "https://e/"});
        expect(tags).toContain("<title>&quot;A&quot; &lt;B&gt;</title>");
        expect(tags).toContain('content="https://e/i.jpg"');
    });
});

describe("replaceShareBlock", () => {
    it("swaps only the marked block", () => {
        const html = "<head><!-- share:start note --><title>Old</title><!-- share:end --><script></script></head>";
        const next = replaceShareBlock(html, "<title>New</title>");
        expect(next).toContain("<title>New</title>");
        expect(next).not.toContain("Old");
        expect(next).toContain("<script></script>");
    });

    it("leaves a page without markers alone", () => {
        expect(replaceShareBlock("<head></head>", "<title>New</title>")).toBe("<head></head>");
    });
});
