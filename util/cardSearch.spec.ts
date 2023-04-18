import { SearchCardData } from "@/types/addPage";
import { makeGeneralSearch, makePrintSearch } from "./cardSearch";
import axios from "axios";
import { generalSearchMock as cardSearchResults } from "@/mocks/cardSearch.mock";

const axiosSpy = jest.spyOn(axios, "get");
axiosSpy.mockResolvedValue({ data: cardSearchResults });

const searchCardData: SearchCardData = {
	cardName: "cardNameTest",
	setCode: "setNameTest",
};

describe("cardSearch util", () => {
	describe("makeGeneralSearch", () => {
		it("should make call to card search api endpoint", async () => {
			await makeGeneralSearch(searchCardData);
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining(searchCardData.cardName));
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining(searchCardData.setCode));
		});

		it("should return apiCard result array", async () => {
			const results = await makeGeneralSearch(searchCardData);
			expect(results).toEqual(cardSearchResults?.data);
		});

		it("should include page param", async () => {
			await makeGeneralSearch(searchCardData, 2);
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining("page=2"));
		});
	});

	describe("makePrintSearch", () => {
		it("should make call to card search api endpoint", async () => {
			await makePrintSearch(searchCardData);
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining(searchCardData.cardName));
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining(searchCardData.setCode));
		});

		it("should return apiCard result array", async () => {
			const results = await makePrintSearch(searchCardData);
			expect(results).toEqual(cardSearchResults?.data);
		});

		it("should include unique print param", async () => {
			await makePrintSearch(searchCardData);
			expect(axiosSpy).toHaveBeenCalledWith(expect.stringContaining("unique=prints"));
		});
	});
});
