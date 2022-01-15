import { SearchName } from "../../../components/collection-search/name";
import React, { useState } from "react";
import { SearchResults } from "../../../components/collection-search/results";
import { ResultsState } from "../../../types/resultsState";
import LoadingAnimation from '../../../components/loader-animation';
import styles from "../../../styles/collectionSearchResults.module.scss";
import { SearchText } from "../../../components/collection-search/text";
import { helpers } from "../../../util/helpers";
import { SearchTypes } from "../../../components/collection-search/types";
import { CardTypeClasses } from "../../../types/jsClasses";


export default function Search(){
    const searchEndpoint = '/api/collection/search/?action=searchQuery';
    //class names used for interactivity
    const jsClassNames = {
        types: {
            item:'js-item-type',
            removeItem: 'js-remove-item-type',
            changeIs: 'js-change-item-type-is',
        } as CardTypeClasses
    }

    const [searchQueryState, setSearchQueryState] = useState({
        cardName: '',
        cardText: '',
        cardTypes: [] as {name:string, is:boolean}[],
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

    const typesClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        const clickedElement = event.target as HTMLElement;

        //add from avaialable types list to selected list
        if(clickedElement.className.includes(jsClassNames.types.item)){
            const type = {name:clickedElement.innerHTML, is:true}
            searchQueryState.cardTypes.push(type);
            updateSearchQueryState();
        }

        //remove item from selected list
        else if(clickedElement.className.includes(jsClassNames.types.removeItem)){
           const itemToRemove = clickedElement.dataset.index ? parseInt(clickedElement.dataset.index) : null;

           //verify we have a number
           if(itemToRemove == null){
               return;
           }

           searchQueryState.cardTypes.splice(itemToRemove, 1);
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

                <div className={styles.searchTypeSection + " form-section"} onClick={typesClickHandler}>
                    <SearchTypes selectedTypes={searchQueryState.cardTypes} classes={jsClassNames.types}/>
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