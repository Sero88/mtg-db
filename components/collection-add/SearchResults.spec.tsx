import { SearchResults } from "./SearchResults";
import * as SearchResultsGeneralComponent from "../SearchResultsGeneral";
import * as SearchResultsPrintComponent from "../SearchResultsPrint";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { render, screen } from "@testing-library/react";
import { generalSearchMock, printSearchMock } from "@/mocks/cardSearch.mock";

const cardData = {
	data: generalSearchMock.data,
	type: CardSearchResultsTypeEnum.GENERAL,
};

jest.mock("../SearchResultsGeneral", () => {
	const originalModule = jest.requireActual("../SearchResultsGeneral");
	return {
		__esModule: true,
		...originalModule,
	};
});

jest.mock("../SearchResultsPrint", () => {
	const originalModule = jest.requireActual("../SearchResultsPrint");
	return {
		__esModule: true,
		...originalModule,
	};
});

const searchResultsGeneralSpy = jest.spyOn(SearchResultsGeneralComponent, "SearchResultsGeneral");
const searchResultsPrintSpy = jest.spyOn(SearchResultsPrintComponent, "SearchResultsPrint");

describe("SearchResults component", () => {
	it("should display search title", () => {
		render(<SearchResults cardData={cardData} />);

		const heading = screen.queryByRole("heading", { level: 2 });

		expect(heading).not.toBeNull();
	});
	it("should display SearchResultsGeneral if results are general", () => {
		render(<SearchResults cardData={cardData} />);

		expect(searchResultsGeneralSpy).toHaveBeenCalled();
	});

	it("should display SearchResultsPrint if results are print", () => {
		const cardData = {
			data: printSearchMock.data,
			type: CardSearchResultsTypeEnum.PRINT,
		};
		render(<SearchResults cardData={cardData} />);

		expect(searchResultsPrintSpy).toHaveBeenCalled();
	});
});
