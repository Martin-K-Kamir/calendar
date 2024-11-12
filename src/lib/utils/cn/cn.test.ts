import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn()", () => {
    it("should merge class names correctly", () => {
        const result = cn("class1", "class2");
        expect(result).toBe("class1 class2");
    });

    it("should handle conditional class names", () => {
        const result = cn("class1", false && "class2", "class3");
        expect(result).toBe("class1 class3");
    });

    it("should handle arrays of class names", () => {
        const result = cn(["class1", "class2"], "class3");
        expect(result).toBe("class1 class2 class3");
    });

    it("should handle objects with boolean values", () => {
        const result = cn({ class1: true, class2: false, class3: true });
        expect(result).toBe("class1 class3");
    });

    it("should merge Tailwind classes correctly", () => {
        const result = cn("bg-red-500", "bg-blue-500");
        expect(result).toBe("bg-blue-500");
    });
});
