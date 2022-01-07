import { SearchName } from "../../../components/collection-search/name";
import React, { useState } from "react";
import { SearchResults } from "../../../components/collection-search/results";
import { ResultsState } from "../../../types/resultsState";


export default function Search(){
    const searchEndpoint = '/api/collection/search/?action=searchQuery';
    const [searchQueryState, setSearchQueryState] = useState({
        cardName: '',
        before: 'update',
    });

    const initialResultsState:ResultsState = {
        results: [],
        canShowResults: false
    }
    
    const [resultsState, setResultsState] = useState(initialResultsState);


    const searchForCards = async() => {
        const searchResults = await fetch(searchEndpoint, {
            method: 'POST', 
            body: JSON.stringify({
               searchQuery: searchQueryState
            })
        });

        const results =  await searchResults.json();

        if('status' in results && results.status == 'success'){

            //todo remove after testing 👇
            console.log('results: ', results.data );
            //todo remove after testing 👆

            resultsState.results = results.data;
            resultsState.canShowResults = true;

            setResultsState(prevState => {
                return {...prevState, ...resultsState}
            });
        }
        
    };

    const submitHandler = async (event:React.FormEvent) => {

        event.preventDefault();
        const searchResult = searchForCards();
        
    };

    const onChangeHandler =  (event: React.ChangeEvent<HTMLInputElement>) => {  

        if(event.target.name == 'cardName'){
            searchQueryState.cardName = event.target.value;
        }
        
       
        //update the state, using prev state so it merges prev values and it doesn't overwrite it
        setSearchQueryState( prevState => {
            return {...prevState, ...searchQueryState}
        });
    
       
    };

    //todo remove after testing 👇
    console.log('results after update: ', resultsState);
    //todo remove after testing 👆

    return (
    <>
        <div className="searchForm">
            <h1>Search Collection</h1>
            <form action="search/results/" onSubmit={submitHandler}>
                <SearchName changeHandler={onChangeHandler} name={searchQueryState.cardName}/>
                <input type="submit" value="Search"/>
            </form>  
        </div>
        
        <div className="results">
            <SearchResults resultsState={resultsState} />
        </div>
    
    </>
    );
}