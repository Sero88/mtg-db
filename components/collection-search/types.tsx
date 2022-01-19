import { useEffect, useState } from "react";
import { CardTypeClasses } from "../../types/jsClasses";
import { SearchList } from "./_searchList";
import styles from "../../styles/searchTypes.module.scss";
import {SearchSelector} from "./searchSelector";

type SearchTypeProps = {
    selectedTypes: {name:string, is:boolean}[],
    allowPartials: boolean,
    partialsHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    classes: CardTypeClasses,
}

export function SearchTypes({selectedTypes, classes, allowPartials, partialsHandler}:SearchTypeProps){
    const [types, setTypes] = useState([]);
    
    const getTypes = () => {
        const endpoint = '/api/collection/search?action=getTypes';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                  if(response && 'status' in response && response.status == 'success'){
                    setTypes(response.data);
                  }
                }
            );
    };

    useEffect(getTypes,[]);

    return (
        <SearchSelector 
            styles= {styles}
            canChangeIs={true}
            selectedItems={selectedTypes}
            classes={classes}
            listItems={types}
        >
            <label>
                <input type="checkbox" className={classes.partialsToggle} checked={allowPartials} onChange={partialsHandler} name="typePartials"/>
                Allow partials
            </label>
        </SearchSelector>  
    );
}