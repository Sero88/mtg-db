
import styles from '../../styles/search.module.scss';

type NameSearchProps = {
    searchText: string
    searchTextChange: (newSearchText:string) => void
}

export const NameSearch = ({searchText, searchTextChange}:NameSearchProps) => {
    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        searchTextChange(event.target.value)
    }
    
    return (
        <label className={styles.nameField}>
            <span>Card Name:</span>
            <input 
                type="text" 
                name="cardName" 
                onChange={onChange} 
                value={searchText}
                autoComplete="off"
            />
        </label>
    )
}