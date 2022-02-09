import { useEffect, useState } from "react";
import { ApiSet } from "../../types/apiSet";
import { SelectorClasses } from "../../types/jsClasses";
import { DisplayListItem } from "../../types/searchTypes";
import { ApiCardHelper } from "../../util/apiCardHelpers";
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
    const [scryfallSets, updateScryfallSets] = useState([] as ApiSet[])

    const getCollectionSets = (scryfallSets:ApiSet[]) => {
        const endpoint = '/api/collection/search?action=getSets';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {

                //verify we were able to retrieve collection data
                if(response && 'status' in response && response.status !== 'success'){
                    return [''];
                }

                const searchSets = response.data.map( (set:string) => {
                    for(const scryfallSet of scryfallSets){
                        if(scryfallSet.code.includes(set)){
                            return {name: scryfallSet.name, uri:scryfallSet.icon_svg_uri, value:set}
                        }
                    }
                    return '';
                });

                    //todo remove after testing 👇
                    console.log('sets', searchSets );
                    //todo remove after testing 👆

                updateSets(searchSets);
                // updateScryfallSets(scryfallSets); //we can keep in state if needed 

                      
            });
    }
    const getScryfallSets = () => {
        ApiCardHelper.getAllSets()
            .then( setsList => {
                getCollectionSets(setsList.data);
            });
    };

    useEffect(getScryfallSets,[]);

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