import { QueryClient, QueryClientProvider } from "react-query";
import { useCardSearch } from "./useCardSearch";
import { ReactElement } from "react";
import { renderHook } from "@testing-library/react-hooks";
import {
	generalSearchMock,
	generalSearchWithOneResultMock,
	printSearchMock,
} from "@/mocks/cardSearch.mock";
import { makeGeneralSearch, makePrintSearch } from "@/util/cardSearch";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: ReactElement }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const args = {
	searchCardData: {
		cardName: "testName",
		setCode: "testSet",
	},
	page: 1,
};

jest.mock("@/util/cardSearch");
const mockedGeneralSearch = jest.mocked(makeGeneralSearch);
mockedGeneralSearch.mockResolvedValue(generalSearchMock?.data);

const mockedPrintSearch = jest.mocked(makePrintSearch);
mockedPrintSearch.mockResolvedValue(printSearchMock?.data);

describe("useCardSearch() hook", () => {
	it("should return general search type and data", async () => {
		const { result, waitFor, waitForNextUpdate } = renderHook(() => useCardSearch(args), {
			wrapper,
		});

		await waitForNextUpdate();
		await waitFor(() => result.current.isSuccess);
		expect(result.current.data?.data).toEqual(generalSearchMock?.data);
		expect(result.current.data?.type).toEqual(CardSearchResultsTypeEnum.GENERAL);
	});

	it("should return general print type and data", async () => {
		mockedGeneralSearch.mockResolvedValue(generalSearchWithOneResultMock?.data);
		const { result, waitFor, waitForNextUpdate } = renderHook(() => useCardSearch(args), {
			wrapper,
		});

		await waitForNextUpdate();
		await waitFor(() => result.current.isSuccess);
		expect(result.current.data?.data).toEqual(printSearchMock?.data);
		expect(result.current.data?.type).toEqual(CardSearchResultsTypeEnum.PRINT);
	});
});
