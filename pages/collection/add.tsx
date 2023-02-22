import SearchByName from "../../components/search-by-name";
import React, {useState, useEffect } from "react";
import SearchResults from "../../components/search-results";
import {ApiResultsList} from "../../types/apiResultsList";
import {ApiSet} from "../../types/apiSet";
import LoaderAnimation from "../../components/loader-animation";
import {helpers} from '../../util/helpers';
import {useRouter} from 'next/router';
import { PreviousStateType } from '../../types/previousState';
import { ApiCardHelper } from "../../util/apiCardHelpers";

import { NameSearch } from "../../components/collection-add/NameSearch";
import { SetSearch } from "../../components/collection-add/SetSearch";

let searchTimeout: NodeJS.Timeout;

export default function AddPage(){
    const router = useRouter();
    
    const apiInitial:ApiResultsList = {
        data: [],
        has_more: false,
        next_page: '',
        total_cards: 0,
        warnings: [''],
    };

    const prevInitialState:PreviousStateType = {
        query:  '',
        results: apiInitial,
        searchText: '', 
        cardId: '',
        page: 0
    }

    const [searchText, setSearchText] = useState('');

    const searchTextChange = (newSearchText:string) => {
        setSearchText(newSearchText)
    }

    const [addPageState, setAddPageState] = useState({
        searchText: "",
        apiResults: apiInitial,
        previousState: prevInitialState,
        isTyping: false,
        isFocused: false,
        showSuggestions: false,
        showResults: false,
        fetchedQuery: "",
        showPrints: false,
        cardSets: [],
        selectedSet: "",
        showLoader: false,
        generalResultsPage: 0
    });

    function updatePageState(){
        setAddPageState( (prevState) => {
            return {...prevState, ...addPageState};
        });
    }

    //function to search cards
    const searchCards = (cardName:string, _showResults:boolean, _showSuggestions:boolean, _showPrints:boolean = false, _generalResultsPage = addPageState.generalResultsPage) => {
     
        //user is no longer typing                 
        addPageState.isTyping = false;
        updatePageState();
        
        //we're switching from results to print results
        if((!addPageState.showPrints && _showPrints)){
            const previousStateData:PreviousStateType = {
                query:  addPageState.fetchedQuery,
                results: addPageState.apiResults,
                searchText: addPageState.searchText,
                cardId: helpers.convertNameToId(cardName),
                page: addPageState.generalResultsPage
            }

            addPageState.previousState = previousStateData;
            updatePageState();
        }

        cardName = cardName && _showPrints
            ? `"${encodeURIComponent(cardName)}"`
            : cardName;

        const set = addPageState.selectedSet 
            ? ` set:${addPageState.selectedSet},s${addPageState.selectedSet},p${addPageState.selectedSet}` 
            : '';


        const page = _generalResultsPage
            ? _generalResultsPage
            : 1;
           
        let endpoint = _showPrints 
            ? '/api/scryfall/cards/?order=released&unique=prints&query=!' + cardName + set
            : '/api/scryfall/cards/?query=' + encodeURIComponent(cardName + set) + "&page=" + page;
  
        //fetch new data only if the new search query is different than what we already fetched
        if( endpoint != addPageState.fetchedQuery ){

            addPageState.showLoader = true;
            updatePageState();

            fetch(endpoint)
            .then(response => response.json())
            .then(data => 
                {          

                     //if the retrieved data is of only one card, query for the multiple prints that specific card
                    if('total_cards' in data && data.total_cards == 1 && !_showPrints){
                        if('data'in data && data.data[0]){
                            searchCards(data.data[0].name, true, false, true, 1);     
                        }

                        addPageState.showLoader = false;
                        updatePageState();
                        return;
                    }

                    addPageState.apiResults = data;
                    addPageState.showSuggestions = _showSuggestions;
                    addPageState.showPrints = _showPrints;
                    addPageState.fetchedQuery = endpoint;
                    addPageState.showLoader = false;
                    addPageState.generalResultsPage = page;
                    addPageState.showResults = _showResults;
                    updatePageState();
                                                                              
                }
            );
        } else {
            addPageState.showSuggestions = false;
            addPageState.showResults = true;
            updatePageState();
        }
    }

    //search handler
    const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {  

        clearInterval(searchTimeout);
        if(event.target.value){
            searchTimeout = setTimeout(
                ()=>searchCards(event.target.value, false, true), 1200 
            );        
        }

        addPageState.searchText = event.target.value;
        addPageState.generalResultsPage = 0;
        addPageState.showResults = false;
        addPageState.isTyping = true;
        addPageState.showSuggestions = false; //user has started typing - don't show suggestions until we have results   
        updatePageState();
    }

    //submit handler 
    const submitHandler = (event: React.FormEvent<Element>) => {
        event.preventDefault();    

        addPageState.showSuggestions = false; // user has submitted an entry, do not show any suggestions
        updatePageState();
        clearInterval(searchTimeout);
        searchCards(addPageState.searchText, true, false, false, 0);

    }

    //click handler
    const clickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {  
        const clickedElement = event.target as HTMLElement;
        if('name' in clickedElement.dataset) {
            //show the add cards module
            if(clickedElement.matches('img')){
            
                if('type' in clickedElement.dataset) {
                    if(clickedElement.dataset.type == 'print'){
                        //show modole to add to collection
                        return;
                    }
                }
            }
            const cardName = clickedElement.dataset.name ? clickedElement.dataset.name : '';            
            
            addPageState.showSuggestions = false;
            addPageState.searchText = cardName;
            addPageState.generalResultsPage = 0;
            updatePageState();             
             
            searchCards(cardName, true, false, true,1);     
        }
    }

    //changes to oposite
    const focusHandler = () => {               
        addPageState.isFocused = !addPageState.isFocused;
        updatePageState();           
    }

    const getCardSets = () => {
        ApiCardHelper.getAllSets()
            .then( setsList => {
                addPageState.cardSets = setsList.data;
                updatePageState();
            });
    }

    const setChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        addPageState.selectedSet = event.target.value;
        updatePageState();
    }

    const backButtonHandler = (event: React.MouseEvent<Element, MouseEvent>) => {  

        addPageState.showPrints = false;
        addPageState.apiResults = addPageState.previousState.results;
        addPageState.searchText = addPageState.previousState.searchText;
        addPageState.fetchedQuery = addPageState.previousState.query;
        addPageState.generalResultsPage = addPageState.previousState.page;
        updatePageState();
    }

    const updatePageResults = ( page: number) => {
        page !== 0 && searchCards(addPageState.searchText, true, false, false, page);
    }

    //get the sets on load
    useEffect(getCardSets,[false]); //can leave [] so it never updates, but setting false explicitely to remember it is not meant to update

    useEffect(function(){
       addPageState.previousState.cardId && !addPageState.showPrints ? window.location.href = router.pathname+"#" + addPageState.previousState.cardId : '';
    },[addPageState.apiResults])

    
    return (
        <>
            <h1>Add Cards</h1>
            <div>
                <NameSearch searchText={searchText} searchTextChange={searchTextChange} />
            </div>

            <SearchByName 
                cardSearchText={addPageState.searchText} 
                cardSearchHandler={searchHandler}
                focusHandler={focusHandler}
                clickHandler={clickHandler}
                submitHandler={submitHandler}
                setChangeHandler={setChangeHandler}
                cards={addPageState.apiResults.data && addPageState.apiResults.data.map(card =>card.name)} //show the suggestion only when user hasn't picked one
                sets={addPageState.cardSets}
                showSuggestions={addPageState.showSuggestions}
                isTyping={addPageState.isTyping}
                isFocused={addPageState.isFocused}
            />

            {addPageState.showLoader &&
                <LoaderAnimation/>
            }

            {addPageState.showResults && 
                <SearchResults 
                    apiResults={addPageState.apiResults} 
                    showPrints={addPageState.showPrints}
                    clickHandler={clickHandler}
                    backButtonHandler={backButtonHandler}
                    fetchedQuery={addPageState.fetchedQuery}
                    updatePageResults={updatePageResults}
                    generalResultsPage={addPageState.generalResultsPage}
                    previousState={addPageState.previousState}/>
            }
        </>
    )
}