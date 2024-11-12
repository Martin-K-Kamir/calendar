import { describe, it, expect } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize()", () => {
    it("should capitalize the first letter of a lowercase word", () => {
        expect(capitalize("hello")).toBe("Hello");
    });

    it("should capitalize only the first word", () => {
        expect(capitalize("hello world")).toBe("Hello world");
    });

    it("should handle an empty string", () => {
        expect(capitalize("")).toBe("");
    });
});
