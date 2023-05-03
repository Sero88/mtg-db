import { ApiCard } from "@/types/apiCard";
import styles from "@/styles/card.module.scss";
import { useContext } from "react";

type CardDetailsProps = {
	data: ApiCard;
	clickHandler: Function;
};
export function GeneralCardDetails({ data, clickHandler }: CardDetailsProps) {
	return (
		<div className={styles.cardDetails}>
			<p>
				<strong className={styles.cardNameLink} onClick={() => clickHandler(data.name)}>
					{data.name}
				</strong>
			</p>
		</div>
	);
}
