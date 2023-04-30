import { ApiCard } from "@/types/apiCard";
import { helpers } from "@/util/helpers";
import styles from "@/styles/results.module.scss";
import { GeneralCard } from "./Cards/GeneralCard";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { CardListItems } from "./Cards/CardListItems";

type SearchResultsGeneralProps = {
	cardData: ApiCard[];
};
export function SearchResultsGeneral({ cardData }: SearchResultsGeneralProps) {
	return (
		<>
			<p>{cardData.length} cards matched your search.</p>
			<ul onClick={() => {}} className={styles.resultsList}>
				<CardListItems cards={cardData} type={CardSearchResultsTypeEnum.GENERAL} />
			</ul>
		</>
	);
}
