
import React, {useState} from 'react';
import { helpers } from '../../util/helpers';
import styles from '../../styles/_searchList.module.scss';
import { SelectorClasses } from '../../types/jsClasses';
import { DisplayListItem } from '../../types/searchTypes';

type SearchListProps = {
    listItems:DisplayListItem[],
    classes: SelectorClasses,
    queryKey: string,
    selectorClickHandler:  (event:React.MouseEvent) => void
}

export function SearchList({listItems,classes, queryKey, selectorClickHandler}:SearchListProps){
    const [searchText, setSearchText] = useState('');
    
    const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }

    const clearClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault();
        setSearchText('');
    }


    const showList = searchText ? helpers.getTextMatchesFromList(searchText,listItems) : listItems;


    const results = showList.map( (item:DisplayListItem, index:number) => {
        return (
            <li 
                key={index} 
                className={classes.itemWrapper} 
                data-key={queryKey}
                data-name={item.name} 
                data-value={item.value ?? ''}
                data-image={item.uri ?? ''}
                onClick={selectorClickHandler}
            >
                {item.uri && helpers.getDisplayItemImage(item)}<span className={classes.item}>{item.name}</span>
            </li>
        );
    });


    return (
        <div className={styles.searchList}>
            <input onChange={searchHandler} type="text" value={searchText}/>
            <a href="#" onClick={clearClickHandler}>Clear</a>
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