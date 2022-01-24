import { useEffect, useState } from "react";
import { SelectorClasses } from "../../types/jsClasses";
import { DisplayListItem } from "../../types/searchTypes";
import {SearchSelector} from "./searchSelector";

type SearchTypeProps = {
    selectedItems: {name:string, is:boolean}[],
    queryKey:string,
    allowPartials: boolean,
    partialsHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    classes: SelectorClasses,
    partialsName:string,
    selectorClickHandler:  (event:React.MouseEvent) => void
}

export function SearchTypes({selectedItems, classes, allowPartials, queryKey, partialsHandler, partialsName, selectorClickHandler}:SearchTypeProps){
    const [types, setTypes] = useState([] as DisplayListItem[]);
    
    const getTypes = () => {
        const endpoint = '/api/collection/search?action=getTypes';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                  if(response && 'status' in response && response.status == 'success'){
                      const retrievedTypes = response.data.map( (type:string) => {
                          return {name: type, value: type}
                      });
                    setTypes(retrievedTypes);
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
            selectorClickHandler={selectorClickHandler}
        >
            <label>
                <input type="checkbox" className={classes.partialsToggle} checked={allowPartials} onChange={partialsHandler} name={partialsName}/>
                Allow partials
            </label>
        </SearchSelector>  
    );
}