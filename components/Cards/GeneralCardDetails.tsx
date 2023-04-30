import { ApiCard } from "@/types/apiCard";
import styles from "@/styles/card.module.scss";
import Link from "next/link";

type CardDetailsProps = {
	data: ApiCard;
};
export function GeneralCardDetails({ data }: CardDetailsProps) {
	const cardLink = `/collection/add/${encodeURIComponent(data.name)}`;
	return (
		<div className={styles.cardDetails}>
			<Link href={cardLink}>
				<a>
					<strong className={styles.cardNameLink} data-name={data.name}>
						{data.name}
					</strong>
				</a>
			</Link>
		</div>
	);
}
