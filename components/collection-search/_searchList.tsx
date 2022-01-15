
import React, {useState} from 'react';
import { helpers } from '../../util/helpers';

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
        setSearchText('');
    }

    const showList = searchText ? helpers.getTextMatchesFromList(searchText,list) : list;


    return (
        <>
            <input onChange={searchHandler} type="text" value={searchText} className='js-search'/>
            <span onClick={clickHandler}>Clear</span>
            <ul>
                {
                    showList.map( (item, index) => {
                        return <li key={index} className={itemClass}>{item}</li>
                    })
                }
            </ul>
        </>
    );
}