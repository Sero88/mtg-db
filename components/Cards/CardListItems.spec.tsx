import { generalSearchMock, printSearchMock } from "@/mocks/cardSearch.mock";
import { CardListItems } from "./CardListItems";
import { render, screen } from "@testing-library/react";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import * as GeneralCardComponent from "./GeneralCard";
import * as PrintCardComponent from "./PrintCard";

jest.mock("./GeneralCard", () => {
	const originalModule = jest.requireActual("./GeneralCard");
	return {
		__esModule: true,
		...originalModule,
	};
});

jest.mock("./PrintCard", () => {
	const originalModule = jest.requireActual("./PrintCard");
	return {
		__esModule: true,
		...originalModule,
	};
});

const generalCardSpy = jest.spyOn(GeneralCardComponent, "GeneralCard");
const printCardSpy = jest.spyOn(PrintCardComponent, "PrintCard");

describe("CardListItems component", () => {
	it("should display General list card item when type is general", () => {
		render(
			<CardListItems
				cards={generalSearchMock.data}
				type={CardSearchResultsTypeEnum.GENERAL}
				clickHandler={jest.fn()}
			/>
		);

		expect(generalCardSpy).toHaveBeenCalledTimes(generalSearchMock.data.length);
	});

	it("should display Print list card item when type is print", () => {
		render(
			<CardListItems
				cards={printSearchMock.data}
				type={CardSearchResultsTypeEnum.PRINT}
				clickHandler={jest.fn()}
			/>
		);

		expect(printCardSpy).toHaveBeenCalledTimes(printSearchMock.data.length);
	});
});
