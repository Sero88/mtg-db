import { useQuery } from "react-query";
import { SearchCardData } from "@/types/addPage";
import axios from "axios";
import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/cardSearchResultsTypeEnum";

type useCardSearchProps = {
	searchCardData: SearchCardData;
	page: number;
};

export function useCardSearch({ searchCardData, page }: useCardSearchProps) {
	return useQuery(["cardSearch", searchCardData.cardName, searchCardData.setCode], async () => {
		if (!searchCardData.cardName && !searchCardData.setCode) {
			return undefined;
		}

		const generalResults = await makeGeneralSearch(searchCardData, page);
		let printResults = undefined;

		if (generalResults?.length == 1) {
			printResults = await makePrintSearch(searchCardData);
		}

		return {
			data: printResults ?? generalResults,
			type: printResults
				? CardSearchResultsTypeEnum.PRINT
				: CardSearchResultsTypeEnum.GENERAL,
		};
	});
}

async function makeGeneralSearch(searchCardData: SearchCardData, page: number) {
	const setParam = searchCardData.setCode
		? ` set:${searchCardData.setCode},s${searchCardData.setCode},p${searchCardData.setCode}`
		: "";

	const searchEndpoint =
		"/api/scryfall/cards/?query=" +
		encodeURIComponent(searchCardData.cardName + setParam) +
		"&page=" +
		page;

	const results = await axios.get(searchEndpoint);

	return results?.data?.data as ApiCard[];
}

async function makePrintSearch(searchCardData: SearchCardData) {
	return [];
}
