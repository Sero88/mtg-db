import { generalSearchMock } from "@/mocks/cardSearch.mock";
import { GeneralCardList } from "./GeneralCardList";
import { render, screen } from "@testing-library/react";

describe("GeneralCardList component", () => {
	it("should display card list", () => {
		render(<GeneralCardList cardData={generalSearchMock.data} clickHandler={jest.fn()} />);
		const list = screen.queryByRole("list");

		expect(list).not.toBeNull();
	});
});
