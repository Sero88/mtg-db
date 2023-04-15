import styles from "../../styles/CardSuggestions.module.scss";
type CardSuggestionsProps = {
	cards: string[];
	limit: number;
	selectionHandler: (selectedString: string) => void;
};

export const noMatchesText = "No matches found";

export function CardSuggestions({ cards, limit, selectionHandler }: CardSuggestionsProps) {
	const cardsLength = cards?.length ?? 0;
	const suggestions = [];

	const clickHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
		const selection = e.target as HTMLElement;
		selectionHandler(selection.innerHTML);
	};

	if (cardsLength < 1) {
		return (
			<p>
				<em>{noMatchesText}</em>
			</p>
		);
	}

	for (let i = 0; i < limit && i < cardsLength; i++) {
		suggestions.push(
			<li key={i} data-name={cards[i]} onClick={clickHandler}>
				{cards[i]}
			</li>
		);
	}

	return (
		<div className={styles.searchSuggestions}>
			<span className={styles.suggestionsTitle}>Card Suggestions</span>
			<ul>{suggestions}</ul>
		</div>
	);
}
