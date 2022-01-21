import { useEffect, useState } from "react";
import { SelectorClasses } from "../../types/jsClasses";
import {SearchSelector} from "./searchSelector";

type SearchTypeProps = {
    selectedItems: {name:string, is:boolean}[],
    queryKey:string,
    allowPartials: boolean,
    partialsHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    classes: SelectorClasses,
}

export function SearchColors({selectedItems, classes, allowPartials, queryKey, partialsHandler}:SearchTypeProps){
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
            canChangeIs={true}
            selectedItems={selectedItems}
            classes={classes}
            listItems={types}
            queryKey={queryKey}
        >
            <label>
                <input type="checkbox" className={classes.partialsToggle} checked={allowPartials} onChange={partialsHandler} name="typePartials"/>
                Allow partials
            </label>
        </SearchSelector>  
    );
}