import { useEffect, useState } from "react";
import { ApiSet } from "../../types/apiSet";
import { SelectorClasses } from "../../types/jsClasses";
import { DisplayListItem, SelectorListType, SelectorListTypeItem } from "../../types/searchTypes";
import { ApiCardHelper } from "../../util/apiCardHelpers";
import { helpers } from "../../util/helpers";
import {SearchSelector} from "./searchSelector";

type SearchSetsProps = {
    selectedItems: SelectorListTypeItem[],
    queryKey:string,
    classes: SelectorClasses,
    selectorClickHandler:  (event:React.MouseEvent) => void
}

export function SearchSets({selectedItems, classes, queryKey, selectorClickHandler}:SearchSetsProps){
    const [sets, updateSets] = useState([] as DisplayListItem[]);
    //const [scryfallSets, updateScryfallSets] = useState([] as ApiSet[])

    const getCollectionSets = (scryfallSets:ApiSet[]) => {
        const endpoint = '/api/collection/search?action=getSets';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {

                //verify we were able to retrieve collection data
                if(response && 'status' in response && response.status !== 'success'){
                    return [''];
                }

                const searchSets = [] as DisplayListItem[];
            
                for(const scryfallSet of scryfallSets){
                    if(searchSets.length == response.data.length){
                        break;
                    }

                    response.data.forEach( (set:string) =>{
                        // scryfall broke the 3 letter mtg set convetion, so some sets on scryfall have more then 3 letters such as hrt20
                        // parent_set_code is set for scryfall sets such as promo and tokens, the parent is the set we want, so ignore the child
                        // lastly, if none of the above worked, convert the set into three letters and check againts it
                        if( !scryfallSet.parent_set_code && ( scryfallSet.code == set || helpers.getCardSet(scryfallSet.code) == set)){
                            searchSets.push({name: scryfallSet.name, uri:scryfallSet.icon_svg_uri, value:set});
                        }
                    })
                    
                }
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
            canChangeIs={false}
            selectedItems={selectedItems}
            classes={classes}
            listItems={sets}
            queryKey={queryKey}
            selectorClickHandler={selectorClickHandler}
        >
            <></>
        </SearchSelector>  
    );
}