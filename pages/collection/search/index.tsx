import { SearchName } from "../../../components/collection-search/name";
import React, { useState } from "react";
import { SearchResults } from "../../../components/collection-search/results";
import { ResultsState } from "../../../types/resultsState";
import LoadingAnimation from '../../../components/loader-animation';
import styles from "../../../styles/collectionSearchResults.module.scss";
import { SearchText } from "../../../components/collection-search/text";
import { helpers } from "../../../util/helpers";
import { SearchTypes } from "../../../components/collection-search/types";
import { SearchColors } from "../../../components/collection-search/colors";
import { SelectorClasses } from "../../../types/jsClasses";
import { SelectorListType } from "../../../types/searchTypes";


export default function Search(){
    const searchEndpoint = '/api/collection/search/?action=searchQuery';
    //class names used for interactivity
    const jsClassNames = {
        selectorClasses: {
            item:'js-item-type',
            removeItem: 'js-remove-item-type',
            changeIs: 'js-change-item-type-is',
            partialsToggle: 'js-partials-type-toggle',
        } as SelectorClasses,
    }

    const fieldNames = {
        types: {
            partials: 'typePartials'
        }
    }

    const [searchQueryState, setSearchQueryState] = useState({
        cardName: '',
        cardText: '',
        cardTypes: {queryKey:'cardTypes', items: [], allowPartials: false} as SelectorListType,
        cardColors: {queryKey:'cardColors', items: [], allowPartials: false} as SelectorListType,
        isSearching: false,
    });

    const initialResultsState:ResultsState = {
        results: [],
        canShowResults: false
    }
    
    const [resultsState, setResultsState] = useState(initialResultsState);

    const updateSearchQueryState = () => {
         //update the state, using prev state so it merges prev values and it doesn't overwrite it
        setSearchQueryState( prevState => {
            return {...prevState, ...searchQueryState}
        });
    }

    const updateResultsState = () => {
        setResultsState(prevState => {
            return {...prevState, ...resultsState}
        });
    }

    const searchForCards = async() => {
        const searchResults = await fetch(searchEndpoint, {
            method: 'POST', 
            body: JSON.stringify({
               searchQuery: searchQueryState
            })
        });

        const results =  await searchResults.json();

        if('status' in results && results.status == 'success'){

            resultsState.results = results.data;
            resultsState.canShowResults = true;
            updateResultsState();
            
            searchQueryState.isSearching = false;
            updateSearchQueryState();
        }
        
    };

    const submitHandler = (event:React.FormEvent) => {

        event.preventDefault();

        //update the isSearching flag
        searchQueryState.isSearching = true;
        updateSearchQueryState();
        
        searchForCards();
        
    };

    const onChangeHandler =  (event: React.ChangeEvent<HTMLInputElement>) => {  

        switch (event.target.name){
            case 'cardName':
                searchQueryState.cardName = event.target.value;
            break;

            case 'cardText':
                searchQueryState.cardText = event.target.value;
            break;

            case 'typePartials':
                searchQueryState.cardTypes.allowPartials = !searchQueryState.cardTypes.allowPartials;
            break;
        }
       
       updateSearchQueryState();
    
    };

    const clickHandler = (event: React.MouseEvent<Element, MouseEvent>) =>{
        const clickedElement = event.target as HTMLElement;

        //symbols
        if(helpers.parentHasSymbol(clickedElement)){
            //@ts-ignore
            searchQueryState.cardText += clickedElement.parentElement.dataset.symbol;
            updateSearchQueryState();
            
            //focus on the text input so user can easily modify it after adding the symbol
            const inputText = document.querySelector('input[name="cardText"]') as HTMLInputElement;
            inputText ? inputText.focus() : false;
        }

    };

    const selectorClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        const clickedElement = event.target as HTMLElement;
        const queryKey = clickedElement.dataset.key ? clickedElement.dataset.key : null;

        if(!queryKey){
            return;
        }

        //add from avaialable types list to selected list
        if(clickedElement.className.includes(jsClassNames.selectorClasses.item)){
            const type = {name:clickedElement.innerHTML, is:true}
            //@ts-ignore - it matches the query key so TS can ignore safely
            searchQueryState[queryKey].items.push(type);
            updateSearchQueryState();
        }

        //remove item from selected list
        else if(clickedElement.className.includes(jsClassNames.selectorClasses.removeItem)){
           const itemToRemove = clickedElement.dataset.index ? parseInt(clickedElement.dataset.index) : null;

           //verify we have item
           if(itemToRemove == null){
               return;
           }

           //@ts-ignore - it matches the query key so TS can ignore safely
           searchQueryState[queryKey].items.splice(itemToRemove, 1);
           updateSearchQueryState();
        }

        //change is/not
        else if(clickedElement.className.includes(jsClassNames.selectorClasses.changeIs)){
            const itemToChange = clickedElement.dataset.index ? parseInt(clickedElement.dataset.index) : null;
             //verify we have item
            
             if(itemToChange == null){
                return;
            }

            //@ts-ignore - it matches the query key so TS can ignore safely
            searchQueryState[queryKey].items[itemToChange].is = !searchQueryState[queryKey].items[itemToChange].is;
            updateSearchQueryState();
        }

    }

    return (
    <>
        <div className="searchForm">
            <h1>Search Collection</h1>
            <form action="search/results/" onSubmit={submitHandler} className={styles.searchForm}>
                <div className="form-section">
                    <SearchName changeHandler={onChangeHandler} name={searchQueryState.cardName}/>
                </div>

                <hr />

                <div className={styles.searchTextSection + " form-section"}>
                    <SearchText changeHandler={onChangeHandler} clickHandler={clickHandler} text={searchQueryState.cardText}/>
                </div>

                <hr />

                <div className={styles.searchTypeSection + " form-section"} onClick={selectorClickHandler}>
                <label>Types</label>
                    <SearchTypes 
                        selectedItems={searchQueryState.cardTypes.items} 
                        queryKey={searchQueryState.cardTypes.queryKey}
                        classes={jsClassNames.selectorClasses}
                        allowPartials={searchQueryState.cardTypes.allowPartials}
                        partialsHandler={onChangeHandler}
                        partialsName={fieldNames.types.partials}
                    />
                </div>

                <hr />

                <div className={styles.searchColorsSection + " form-section"} onClick={selectorClickHandler}>
                    <label>Colors</label>
                    <SearchColors
                        selectedItems={searchQueryState.cardColors.items} 
                        queryKey={searchQueryState.cardColors.queryKey}
                        classes={jsClassNames.selectorClasses}
                        allowPartials={searchQueryState.cardColors.allowPartials}
                        partialsHandler={onChangeHandler}
                    />
                </div>
               
                <input type="submit" value="Search"/>
            </form>  
        </div>
        
        {searchQueryState.isSearching 

            ? <LoadingAnimation />
            : (
                <div className="results">
                    <SearchResults 
                        resultsState={resultsState} 
                    />
                </div>
            )
        
        }
    </>
    );
}