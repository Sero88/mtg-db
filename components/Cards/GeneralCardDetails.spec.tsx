import { render, screen } from "@testing-library/react";
import { GeneralCardDetails } from "./GeneralCardDetails";
import { generalSearchMock } from "@/mocks/cardSearch.mock";

const elvishMysticCardData = generalSearchMock.data[0];
describe("GeneralCardDetails component", () => {
	it("should display card name", () => {
		render(<GeneralCardDetails data={elvishMysticCardData} />);
		expect(screen.queryByText(elvishMysticCardData.name)).not.toBeNull();
	});

	it("should display link to card", () => {
		const encodedCardName = encodeURIComponent(elvishMysticCardData.name);
		render(<GeneralCardDetails data={elvishMysticCardData} />);
		expect(screen.getByRole("link", { name: elvishMysticCardData.name })).toHaveProperty(
			"href",
			expect.stringContaining(encodedCardName)
		);
	});
});
