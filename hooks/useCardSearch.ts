import { useQuery } from "react-query";
import { SearchCardData } from "@/types/addPage";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { makeGeneralSearch, makePrintSearch } from "@/util/cardSearch";

type useCardSearchProps = {
	searchCardData: SearchCardData;
	page: number;
};

export function useCardSearch({ searchCardData, page }: useCardSearchProps) {
	return useQuery(["cardSearch", searchCardData.cardName, searchCardData.setCode], async () => {
		if (!searchCardData.cardName && !searchCardData.setCode) {
			return undefined;
		}

		let printResults = undefined;
		const generalResults = await makeGeneralSearch(searchCardData, page);

		if (generalResults?.length == 1) {
			printResults = await makePrintSearch({
				cardName: generalResults[0].name,
				setCode: searchCardData.setCode,
			});
		}

		return {
			data: printResults ?? generalResults,
			type: printResults
				? CardSearchResultsTypeEnum.PRINT
				: CardSearchResultsTypeEnum.GENERAL,
		};
	});
}
