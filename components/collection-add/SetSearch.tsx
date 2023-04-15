import styles from "../../styles/search.module.scss";
import { useGetSets } from "../../hooks/useGetSets";
import { QueryResult } from "../QueryResult";
import { SetOptionsList } from "./SetOptionsList";

type SetSearchProps = {
	selectedSet: string;
	setChangeHandler: (newSelectedSet: string) => void;
};

export const SetSearch = ({ selectedSet, setChangeHandler }: SetSearchProps) => {
	const setsQueryResult = useGetSets();

	const onChangeSet = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setChangeHandler(event.target.value);
	};

	return (
		<QueryResult queryResult={setsQueryResult} errorMessage="Unable to get Sets.">
			<label className={styles.setField}>
				<span>Card Set: </span>
				<select value={selectedSet} onChange={onChangeSet}>
					<option value="">All sets</option>
					<SetOptionsList setsData={setsQueryResult?.data} />
				</select>
			</label>
		</QueryResult>
	);
};
