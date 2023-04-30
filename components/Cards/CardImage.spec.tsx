import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { CardImage } from "./CardImage";
import { render, screen } from "@testing-library/react";
import Image from "next/image";

const imageUri =
	"https://cards.scryfall.io/normal/front/f/2/f2a26496-b4c9-4a29-9a85-26e217deafa2.jpg?1562943762";
const name = "cardName";

jest.mock("next/image", () => {
	const originalModule = jest.requireActual("next/image");
	return {
		__esModule: true,
		default: jest.fn(() => null),
		// ...originalModule,
	};
});

describe("CardImage component", () => {
	it("should have correct src", () => {
		render(
			<CardImage imageUri={imageUri} name={name} type={CardSearchResultsTypeEnum.GENERAL} />
		);

		expect(Image).toHaveBeenCalledWith(
			expect.objectContaining({ src: imageUri }),
			{} //children should be empty
		);
	});

	it("should have correct class for PRINT type", () => {
		render(
			<CardImage imageUri={imageUri} name={name} type={CardSearchResultsTypeEnum.PRINT} />
		);

		expect(Image).toHaveBeenCalledWith(
			expect.objectContaining({ className: "cardImage imagePrint" }),
			{} //children should be empty
		);
	});

	it("should have correct class for GENERAL type", () => {
		render(
			<CardImage imageUri={imageUri} name={name} type={CardSearchResultsTypeEnum.GENERAL} />
		);

		expect(Image).toHaveBeenCalledWith(
			expect.objectContaining({ className: "cardImage" }),
			{} //children should be empty
		);
	});
});
