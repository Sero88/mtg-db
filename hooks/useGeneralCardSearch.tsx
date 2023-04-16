import { useQuery } from "react-query";
import { SearchCardData } from "@/types/addPage";
import { makeGeneralSearch } from "@/util/cardSearch";

type useGeneralCardSearchProps = {
	searchCardData: SearchCardData;
	page: number;
};

export function useGeneralCardSearch({ searchCardData, page }: useGeneralCardSearchProps) {
	return useQuery(
		["generalCardSearch", searchCardData.cardName, searchCardData.setCode],
		async () => {
			if (!searchCardData.cardName && !searchCardData.setCode) {
				return undefined;
			}
			return await makeGeneralSearch(searchCardData, page);
		}
	);
}
