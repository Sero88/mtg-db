
import { useEffect, useState } from 'react';
import styles from '../../styles/search.module.scss';
import { ApiSet } from '../../types/apiSet';
import { ApiCardHelper } from '../../util/apiCardHelpers';
import { setHelper } from '../../util/sets';

type SetSearchProps = {
    selectedSet: string
    setChangeHandler: (newSelectedSet:string) => void
}

export const SetSearch = ({selectedSet, setChangeHandler}:SetSearchProps) => {
    const [sets, setSets] = useState([]);
    const onChangeSet = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChangeHandler(event.target.value);
    }

    useEffect( () => {
        ApiCardHelper.getAllSets()
            .then( setsList => {
                setSets(setsList.data)
            });
    }, [])


    return (
        <label className={styles.setField}><span>Card Set: </span>
            <select value={selectedSet} onChange={onChangeSet}>
                <option value="">All sets</option>
                {
                    sets.map( (set:ApiSet, index:number) => {
                    
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