import { ApiCard } from "@/types/apiCard";
import styles from "@/styles/results.module.scss";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { CardListItems } from "./Cards/CardListItems";

type GeneralCardListProps = {
	cardData: ApiCard[];
	clickHandler: Function;
};
export function GeneralCardList({ cardData, clickHandler }: GeneralCardListProps) {
	return (
		<>
			<ul className={styles.resultsList}>
				<CardListItems
					cards={cardData}
					type={CardSearchResultsTypeEnum.GENERAL}
					clickHandler={clickHandler}
				/>
			</ul>
		</>
	);
}
