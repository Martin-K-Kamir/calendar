import { describe, it, expect } from "vitest";
import { groupChildrenByColumn } from "./group-children-by-column";

describe("groupChildrenByColumn()", () => {
    it("should group children by their column range", () => {
        const child1 = document.createElement("div");
        child1.style.gridColumnStart = "1";
        child1.style.gridColumnEnd = "3";

        const child2 = document.createElement("div");
        child2.style.gridColumnStart = "2";
        child2.style.gridColumnEnd = "4";

        const children = [child1, child2];
        const result = groupChildrenByColumn(children);

        expect(result).toEqual({
            "1": [child1],
            "2": [child1, child2],
            "3": [child2],
        });
    });

    it("should handle empty children array", () => {
        const children: HTMLElement[] = [];
        const result = groupChildrenByColumn(children);

        expect(result).toEqual({});
    });

    it("should handle children with the same column range", () => {
        const child1 = document.createElement("div");
        child1.style.gridColumnStart = "1";
        child1.style.gridColumnEnd = "2";

        const child2 = document.createElement("div");
        child2.style.gridColumnStart = "1";
        child2.style.gridColumnEnd = "2";

        const children = [child1, child2];
        const result = groupChildrenByColumn(children);

        expect(result).toEqual({
            "1": [child1, child2],
        });
    });

    it("should handle children with non-overlapping column ranges", () => {
        const child1 = document.createElement("div");
        child1.style.gridColumnStart = "1";
        child1.style.gridColumnEnd = "2";

        const child2 = document.createElement("div");
        child2.style.gridColumnStart = "3";
        child2.style.gridColumnEnd = "4";

        const children = [child1, child2];
        const result = groupChildrenByColumn(children);

        expect(result).toEqual({
            "1": [child1],
            "3": [child2],
        });
    });
});
