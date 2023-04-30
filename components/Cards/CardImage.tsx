import Image from "next/image";
import styles from "@/styles/card.module.scss";
import { CardSearchResultsTypeEnum } from "@/types/enums/cardSearchResultsTypeEnum";

type CardImageProps = {
	imageUri: string;
	name: string;
	type: CardSearchResultsTypeEnum;
};

export function CardImage({ imageUri, name, type }: CardImageProps) {
	const imageClass = type == CardSearchResultsTypeEnum.PRINT ? " " + styles.imagePrint : "";

	return (
		<Image
			src={imageUri}
			width={196}
			height={273}
			data-name={name}
			data-type={type}
			alt={name}
			className={styles.cardImage + imageClass}
			unoptimized={true}
		/>
	);
}
