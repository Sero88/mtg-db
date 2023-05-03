import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { GeneralCardList } from "../GeneralCardList";
import { SearchResultsPrint } from "../SearchResultsPrint";

type SearchResultsProps = {
	cardData:
		| {
				data: ApiCard[];
				type: CardSearchResultsTypeEnum;
		  }
		| undefined;
	clickHandler: Function;
};

export const SearchResults = ({ cardData, clickHandler }: SearchResultsProps) => {
	if (!cardData?.data?.length) {
		return <p>No cards matched your search.</p>;
	}

	return (
		<div>
			<h2>Search Results</h2>
			<div>
				{cardData.type === CardSearchResultsTypeEnum.GENERAL ? (
					<>
						<p>{cardData.data.length} cards matched your search.</p>
						<GeneralCardList cardData={cardData?.data} clickHandler={clickHandler} />
					</>
				) : (
					<SearchResultsPrint />
				)}
			</div>
		</div>
	);
};
