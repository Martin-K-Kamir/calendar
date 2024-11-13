import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { calculateRemainingHeight } from "@/features/calendar/utils";

describe("calculateRemainingHeight ()", () => {
    beforeEach(() => {
        vi.spyOn(window, "getComputedStyle").mockImplementation(
            () =>
                ({
                    paddingBlockStart: "0",
                    paddingBlockEnd: "0",
                    borderBlockStartWidth: "0",
                    borderBlockEndWidth: "0",
                    rowGap: "0",
                } as unknown as CSSStyleDeclaration)
        );
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("should calculate the remaining height correctly", () => {
        const mockElement = document.createElement("div");
        Object.defineProperties(mockElement, {
            clientHeight: { value: 500 },
        });
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
            paddingBlockStart: "10",
            paddingBlockEnd: "10",
            borderBlockStartWidth: "5",
            borderBlockEndWidth: "5",
            rowGap: "0",
        } as unknown as CSSStyleDeclaration);

        const result = calculateRemainingHeight(mockElement);
        expect(result).toBe(470);
    });

    it("should calculate the remaining height correctly with a threshold", () => {
        const mockElement = document.createElement("div");
        Object.defineProperties(mockElement, {
            clientHeight: { value: 500 },
        });
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
            paddingBlockStart: "10",
            paddingBlockEnd: "10",
            borderBlockStartWidth: "5",
            borderBlockEndWidth: "5",
            rowGap: "0",
        } as unknown as CSSStyleDeclaration);

        const result = calculateRemainingHeight(mockElement, 20);
        expect(result).toBe(450);
    });

    it("should handle non-numeric computed styles gracefully", () => {
        const mockElement = document.createElement("div");
        Object.defineProperties(mockElement, {
            clientHeight: { value: 500 },
        });
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
            paddingBlockStart: "10px",
            paddingBlockEnd: "10px",
            borderBlockStartWidth: "5px",
            borderBlockEndWidth: "5px",
            rowGap: "0px",
        } as unknown as CSSStyleDeclaration);

        const result = calculateRemainingHeight(mockElement);
        expect(result).toBe(470);
    });
});
