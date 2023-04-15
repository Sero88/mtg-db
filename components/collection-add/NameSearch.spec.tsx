import { fireEvent, render, screen } from "@testing-library/react";
import { NameSearch } from "./NameSearch";

const testSearchText = "test";
const searchTextHandler = jest.fn();

describe("NameSearch Component", () => {
	it("should display search text", () => {
		render(<NameSearch cardName={testSearchText} cardNameChange={searchTextHandler} />);
		const nameField = screen.queryByDisplayValue(testSearchText) as HTMLInputElement;

		expect(nameField).not.toBeNull();
		expect(nameField.value).toEqual(testSearchText);
	});

	it("should use the passed searchHandler when values change", () => {
		render(<NameSearch cardName={testSearchText} cardNameChange={searchTextHandler} />);
		const nameField = screen.queryByDisplayValue(testSearchText) as HTMLInputElement;

		fireEvent.change(nameField, { target: { value: "new" } });
		expect(searchTextHandler).toHaveBeenCalled();
	});
});
