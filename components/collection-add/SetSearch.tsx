
import styles from '../../styles/search.module.scss';
import { ApiSet } from '../../types/apiSet';
import { setHelper } from '../../util/sets';
import LoaderAnimation from '../loader-animation';
import { useGetSets } from '../../hooks/useGetSets';

type SetSearchProps = {
    selectedSet: string
    setChangeHandler: (newSelectedSet:string) => void
}

export const SetSearch = ({selectedSet, setChangeHandler}:SetSearchProps) => {
    const {isLoading, error, data} = useGetSets();

    const onChangeSet = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeHandler(event.target.value);
    }

    
    if(isLoading){
        return (<LoaderAnimation />)
    }

    if(error){
        return <p>Error: Unable to get sets</p>
    }

    return (
        <label className={styles.setField}><span>Card Set: </span>
            <select value={selectedSet} onChange={onChangeSet}>
                <option value="">All sets</option>
                {
                    data.map( (set:ApiSet, index:number) => {
                    
                        if( setHelper.isAllowedSearchSet(set) ){
                            return  (
                                <option value={set.code} key={index}>
                                    {set.name}
                                </option>
                            );
                        }                              
                    })
                }
            </select>
        </label>
    )
}