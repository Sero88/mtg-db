
import React, {useState} from 'react';
import { helpers } from '../../util/helpers';
import styles from '../../styles/_searchList.module.scss';

type SearchListProps = {
    list:string[],
    itemClass: string
}

export function SearchList({list,itemClass}:SearchListProps){
    const [searchText, setSearchText] = useState('');
    
    const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }

    const clickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault();
        setSearchText('');
    }

    const showList = searchText ? helpers.getTextMatchesFromList(searchText,list) : list;

    const results =  showList.map( (item, index) => {
        return <li key={index} className={itemClass}>{item}</li>
    })


    return (
        <div className={styles.searchList}>
            <input onChange={searchHandler} type="text" value={searchText}/>
            <a href="#" onClick={clickHandler}>Clear</a>
            {
                results.length > 0 
                ? <ul>
                    {results}
                  </ul>
                : <p className={styles.noResults}>No results found.</p>
            }
            
        </div>
    );
}