import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { SearchResultsGeneral } from "../SearchResultsGeneral";
import { SearchResultsPrint } from "../SearchResultsPrint";

type SearchResultsProps = {
	cardData:
		| {
				data: ApiCard[];
				type: CardSearchResultsTypeEnum;
		  }
		| undefined;
};

export const SearchResults = ({ cardData }: SearchResultsProps) => {
	if (!cardData?.data?.length) {
		return <p>No cards matched your search.</p>;
	}

	return (
		<div>
			<h2>Search Results</h2>
			<div>
				{cardData.type === CardSearchResultsTypeEnum.GENERAL ? (
					<SearchResultsGeneral cardData={cardData?.data} />
				) : (
					<SearchResultsPrint />
				)}
			</div>
		</div>
	);
};
