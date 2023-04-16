import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/cardSearchResultsTypeEnum";

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
		<>
			<h2>Search Results</h2>
			{cardData?.data?.map((card: ApiCard, index) => {
				return <p key={index}>{card.name}</p>;
			})}
		</>
	);
};
