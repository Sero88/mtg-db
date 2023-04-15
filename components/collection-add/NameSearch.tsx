import styles from "../../styles/search.module.scss";

type NameSearchProps = {
	cardName: string;
	cardNameChange: (newSearchText: string) => void;
};

export const NameSearch = ({ cardName, cardNameChange }: NameSearchProps) => {
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		cardNameChange(event.target.value);
	};

	return (
		<label className={styles.nameField}>
			<span>Card Name:</span>
			<input
				type="text"
				name="cardName"
				onChange={onChange}
				value={cardName}
				autoComplete="off"
			/>
		</label>
	);
};
