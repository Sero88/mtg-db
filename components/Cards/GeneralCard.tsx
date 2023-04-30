import styles from "@/styles/card.module.scss";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";
import { CardImage } from "./CardImage";
import { GeneralCardDetails } from "./GeneralCardDetails";
import { ApiCard } from "@/types/apiCard";

type GeneralCardProps = {
	data: ApiCard;
};

export function GeneralCard({ data }: GeneralCardProps) {
	const cardImageUrl = data.image_uris?.normal ?? "";

	return (
		<div className={styles.card}>
			<div className={styles.imageCollectionWrapper}>
				<CardImage
					imageUri={cardImageUrl}
					name={data.name}
					type={CardSearchResultsTypeEnum.GENERAL}
				/>
			</div>
			<GeneralCardDetails data={data} />
		</div>
	);
}
