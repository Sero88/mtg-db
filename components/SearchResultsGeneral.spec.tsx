import { generalSearchMock } from "@/mocks/cardSearch.mock";
import { SearchResultsGeneral } from "./SearchResultsGeneral";
import { render, screen } from "@testing-library/react";

describe("SearchResultsGeneral component", () => {
	it("should display correct results length", () => {
		render(<SearchResultsGeneral cardData={generalSearchMock.data} />);

		expect(
			screen.queryByText(`${generalSearchMock.data.length} cards matched your search.`)
		).not.toBeNull();
	});

	it("should display card list", () => {
		render(<SearchResultsGeneral cardData={generalSearchMock.data} />);
		const list = screen.queryByRole("list");

		expect(list).not.toBeNull();
	});
});
