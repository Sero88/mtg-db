import { useEffect, useState } from "react";
import { SelectorClasses } from "../../types/jsClasses";
import { DisplayListItem } from "../../types/searchTypes";
import {SearchSelector} from "./searchSelector";

type SearchSetsProps = {
    selectedItems: {name:string, is:boolean}[],
    queryKey:string,
    allowPartials: boolean,
    partialsHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    classes: SelectorClasses,
    partialsName:string,
    selectorClickHandler:  (event:React.MouseEvent) => void
}

export function SearchSets({selectedItems, classes, allowPartials, queryKey, partialsHandler, partialsName, selectorClickHandler}:SearchSetsProps){
    const [sets, updateSets] = useState([] as DisplayListItem[]);
    
    const getSets = () => {
        const endpoint = '/api/collection/search?action=getSets';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
               
                  if(response && 'status' in response && response.status == 'success'){
                      const retrievedSets = response.data.map( (type:string) => {
                          return {name: type, value: type}
                      });
                      
                    updateSets(retrievedSets);
                  }
                }
            );
    };

    useEffect(getSets,[]);

    return (
        <SearchSelector 
            canChangeIs={true}
            selectedItems={selectedItems}
            classes={classes}
            listItems={sets}
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