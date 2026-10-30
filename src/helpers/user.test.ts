import {describe, expect, it} from "vitest";
import type {User} from "@supabase/supabase-js";
import {userIdentity} from "@/helpers/user";

const user = (meta: Record<string, unknown>, email = "isa@example.com") => ({email, user_metadata: meta}) as unknown as User;

describe("userIdentity", () => {
    it("reads an email sign-up's full name", () => {
        expect(userIdentity(user({full_name: "İsa Məmmədli"}))).toMatchObject({name: "İsa Məmmədli", initials: "İM", avatar: ""});
    });

    it("reads Google's name and photo", () => {
        expect(userIdentity(user({name: "Jane Austen", picture: "https://lh3.example/p.jpg"}))).toMatchObject({initials: "JA", avatar: "https://lh3.example/p.jpg"});
    });

    it("falls back to the email's first letter", () => {
        expect(userIdentity(user({}, "reader@example.com"))).toMatchObject({name: "", initials: "R"});
        expect(userIdentity(null).initials).toBe("?");
    });
});
