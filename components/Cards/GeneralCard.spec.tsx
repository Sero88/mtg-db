import { GeneralCard } from "./GeneralCard";
import * as CardImageComponent from "./CardImage";
import { fireEvent, render, screen } from "@testing-library/react";
import { generalSearchMock } from "@/mocks/cardSearch.mock";
import * as GeneralCardDetailsComponent from "./GeneralCardDetails";

jest.mock("./CardImage", () => {
	const originalModule = jest.requireActual("./CardImage");
	return {
		__esModule: true,
		...originalModule,
	};
});
jest.mock("./GeneralCardDetails", () => {
	const originalModule = jest.requireActual("./GeneralCardDetails");
	return {
		__esModule: true,
		...originalModule,
	};
});

const cardImageSpy = jest.spyOn(CardImageComponent, "CardImage");
const generalCardDetailsSpy = jest.spyOn(GeneralCardDetailsComponent, "GeneralCardDetails");

describe("GeneralCard component", () => {
	it("should display CardImage component", () => {
		render(<GeneralCard data={generalSearchMock.data[0]} clickHandler={jest.fn()} />);
		expect(cardImageSpy).toHaveBeenCalled();
	});

	it("should display GeneralCardDetails", () => {
		render(<GeneralCard data={generalSearchMock.data[0]} clickHandler={jest.fn()} />);
		expect(generalCardDetailsSpy).toHaveBeenCalled();
	});

	it("should call clickHandler when image is clicked", () => {
		const clickHandler = jest.fn();
		render(<GeneralCard data={generalSearchMock.data[0]} clickHandler={clickHandler} />);
		const image = screen.getByRole("img");
		fireEvent.click(image);

		expect(clickHandler).toHaveBeenCalledWith(generalSearchMock.data[0].name);
	});
});
