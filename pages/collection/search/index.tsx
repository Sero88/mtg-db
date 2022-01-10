import { SearchName } from "../../../components/collection-search/name";
import React, { useState } from "react";
import { SearchResults } from "../../../components/collection-search/results";
import { ResultsState } from "../../../types/resultsState";
import LoadingAnimation from '../../../components/loader-animation';
import styles from "../../../styles/collectionSearchResults.module.scss";
import { SearchText } from "../../../components/collection-search/text";
import { helpers } from "../../../util/helpers";


export default function Search(){
    const searchEndpoint = '/api/collection/search/?action=searchQuery';
    const [searchQueryState, setSearchQueryState] = useState({
        cardName: '',
        cardText: '',
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

        if(helpers.parentHasSymbol(clickedElement)){
            //@ts-ignore
            searchQueryState.cardText += clickedElement.parentElement.dataset.symbol;
            updateSearchQueryState();
            
            //focus on the text input so user can easily modify it after adding the symbol
            const inputText = document.querySelector('input[name="cardText"]') as HTMLInputElement;
            inputText ? inputText.focus() : false;
        }
    };

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