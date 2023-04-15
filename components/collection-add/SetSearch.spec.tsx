import { act, render, screen } from "@testing-library/react";
import { SetSearch } from "./SetSearch";

import { setsList } from "../../tests/mocks/setsList.mock";
import { useGetSets } from "../../hooks/useGetSets";

const selectedSet = "test";
const setChangeHandler = jest.fn();

jest.mock("../../hooks/useGetSets");
const mockUseGetSets = jest.mocked(useGetSets);

describe("NameSearch Component", () => {
	it("should display list of sets", () => {
		//@ts-ignore
		mockUseGetSets.mockImplementation(() => {
			return { data: setsList, isLoading: false, error: false };
		});

		render(<SetSearch selectedSet={selectedSet} setChangeHandler={setChangeHandler} />);

		expect(screen.queryAllByText(/^Set Name [0-9]?/).length).toEqual(2);
	});

	it("should show loader", () => {
		//@ts-ignore
		mockUseGetSets.mockImplementation(() => {
			return { data: undefined, isLoading: true, error: false };
		});

		render(<SetSearch selectedSet={selectedSet} setChangeHandler={setChangeHandler} />);

		expect(screen.queryByTestId("loader")).not.toBeNull();
	});

	it("should display error when query fails", () => {
		//@ts-ignore
		mockUseGetSets.mockImplementation(() => {
			return { data: undefined, isLoading: false, error: true };
		});

		render(<SetSearch selectedSet={selectedSet} setChangeHandler={setChangeHandler} />);

		expect(screen.queryByText(/Error:/)).not.toBeNull();
	});
});
