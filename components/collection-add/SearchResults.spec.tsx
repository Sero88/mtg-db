import { SearchResults } from "./SearchResults";
import * as GeneralCardListComponent from "../GeneralCardList";
import * as SearchResultsPrintComponent from "../SearchResultsPrint";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { render, screen } from "@testing-library/react";
import { generalSearchMock, printSearchMock } from "@/mocks/cardSearch.mock";

const cardData = {
	data: generalSearchMock.data,
	type: CardSearchResultsTypeEnum.GENERAL,
};

jest.mock("../GeneralCardList", () => {
	const originalModule = jest.requireActual("../GeneralCardList");
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

const GeneralCardListSpy = jest.spyOn(GeneralCardListComponent, "GeneralCardList");
const searchResultsPrintSpy = jest.spyOn(SearchResultsPrintComponent, "SearchResultsPrint");

describe("SearchResults component", () => {
	it("should display search title", () => {
		render(<SearchResults cardData={cardData} clickHandler={jest.fn()} />);

		const heading = screen.queryByRole("heading", { level: 2 });

		expect(heading).not.toBeNull();
	});
	it("should display GeneralCardList if results are general", () => {
		render(<SearchResults cardData={cardData} clickHandler={jest.fn()} />);
		expect(GeneralCardListSpy).toHaveBeenCalled();
	});

	it("should display SearchResultsPrint if results are print", () => {
		const cardData = {
			data: printSearchMock.data,
			type: CardSearchResultsTypeEnum.PRINT,
		};
		render(<SearchResults cardData={cardData} clickHandler={jest.fn()} />);
		expect(searchResultsPrintSpy).toHaveBeenCalled();
	});

	it("should display correct results length", () => {
		render(<SearchResults cardData={cardData} clickHandler={jest.fn()} />);

		expect(
			screen.queryByText(`${cardData.data.length} cards matched your search.`)
		).not.toBeNull();
	});
});
