import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { helpers } from "@/util/helpers";
import { GeneralCard } from "./GeneralCard";
import styles from "@/styles/results.module.scss";
import { PrintCard } from "./PrintCard";

type CardListItems = {
	cards: ApiCard[];
	type: CardSearchResultsTypeEnum;
};
export function CardListItems({ cards, type }: CardListItems) {
	const listOfCards = cards?.map((card: ApiCard, index) => {
		return (
			<li id={helpers.convertNameToId(card.name)} className={styles.cardWrapper} key={index}>
				{type === CardSearchResultsTypeEnum.GENERAL ? (
					<GeneralCard data={card} />
				) : (
					<PrintCard data={card} />
				)}
			</li>
		);
	});

	return <>{listOfCards}</>;
}
