import { render, screen } from "@testing-library/react";
import { SetOptionsList } from "./SetOptionsList";
import { setsList } from "tests/mocks/setsList.mock";

describe("SetOptionsList", () => {
	it("should render option with set code as value", () => {
		render(<SetOptionsList setsData={setsList} />);

		expect(screen.queryByText(/Set Name 1/)).toHaveProperty("value", "tst");
	});

	it("should display all allowed sets items is data", () => {
		render(<SetOptionsList setsData={setsList} />);
		expect(screen.queryAllByText(/^Set Name [0-9]?/).length).toEqual(2);
	});
});
