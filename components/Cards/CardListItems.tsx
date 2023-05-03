import { ApiCard } from "@/types/apiCard";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { helpers } from "@/util/helpers";
import { GeneralCard } from "./GeneralCard";
import styles from "@/styles/results.module.scss";
import { PrintCard } from "./PrintCard";

type CardListItems = {
	cards: ApiCard[];
	type: CardSearchResultsTypeEnum;
	clickHandler: Function;
};
export function CardListItems({ cards, type, clickHandler }: CardListItems) {
	const listOfCards = cards?.map((card: ApiCard, index) => {
		return type === CardSearchResultsTypeEnum.GENERAL ? (
			<li id={helpers.convertNameToId(card.name)} className={styles.cardWrapper} key={index}>
				<GeneralCard data={card} clickHandler={clickHandler} />
			</li>
		) : (
			<li className={styles.cardWrapper} key={index}>
				<PrintCard data={card} />
			</li>
		);
	});

	return <>{listOfCards}</>;
}
