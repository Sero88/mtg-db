import { setsList } from "../tests/mocks/setsList.mock";
import { setHelper } from "./sets";

describe("setHelper", () => {
	describe("isAllowedSearchSet", () => {
		it("should return true when set is allowed", async () => {
			const isAllowed = setHelper.isAllowedSearchSet(setsList[0]);
			expect(isAllowed).toEqual(true);
		});

		it("should return false when set is not allowed", async () => {
			const isAllowed = setHelper.isAllowedSearchSet(setsList[2]);
			expect(isAllowed).toEqual(false);
		});
	});
});
