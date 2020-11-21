import { sampleFunc } from "lib/sampleLib";

describe("sample", () => {
    test("sampleFunc", () => {
        expect(sampleFunc(1, 2)).toBe(3);
    });
});
