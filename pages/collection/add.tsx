import SearchByName from "../../components/search-by-name";
import React, {useState, useEffect } from "react";
import SearchResults from "../../components/search-results";
import {list} from "../../types/list";
import {ApiSet} from "../../types/apiSet";

let searchTimeout: NodeJS.Timeout;

export default function AddPage(){
    const apiInitial:list = {
        data: [],
        has_more: false,
        next_page: '',
        total_cards: 0,
        warnings: [''],
    };
    const[searchText, setSearchText] = useState("");   
    const[apiResults, setApiResults] = useState(apiInitial);
    const[isTyping, setIsTyping] = useState(false);
    const[isFocused, setisFocused] = useState(false);
    const[showSuggestions, setShowSuggestions] = useState(false);
    const[showResults, setShowResults] = useState(false);
    const[fetchedQuery, setFetchedQuery] = useState('');
    const[showPrints, setShowPrints] = useState(false);
    const[cardSets, setCardSets] = useState<ApiSet[]>([]);
    const[selectedSet, setSelectedSet] = useState("");

    //function to search cards
    const searchCards = (cardName:string, showResults:boolean, showSuggestions:boolean, showPrints:boolean = false) => {
        
        //user is no longer typing                 
        setIsTyping(false);      

        const set = selectedSet ? ` set:${selectedSet}` : '';
        const endpoint =  showPrints 
            ? '/api/scryfall/cards/?order=released&unique=prints&query=' + encodeURIComponent(cardName + set)
            : '/api/scryfall/cards/?query=' + encodeURIComponent(cardName + set);
        
        //fetch new data only if the new search string (cardName) is different than what we already fetched
        if( endpoint != fetchedQuery || (endpoint == fetchedQuery && 'data' in apiResults && apiResults.data.length == 0) ){
            
            fetch(endpoint)
            .then(response => response.json())
            .then(data => 
                {          
                    console.log('querying: ', endpoint, data);
                
                    //if the retrieved data is of only one card, query for the multiple prints that specific card
                    if(data.total_cards == 1 && !showPrints){
                        searchCards(cardName, true, false, true);
                        setShowPrints(true);
                        return;
                    }

                    setShowPrints(showPrints);

                    //show the results
                    setShowResults(showResults);

                    //show suggestions
                    setShowSuggestions(showSuggestions);

                    //set the new fetched query value
                    setFetchedQuery(cardName);

                    //set the api results
                    setApiResults(data);      
                    
                    
                }
            );
        } else { 
            showResults ? setShowResults(true): setShowResults(false);
            showSuggestions ? setShowSuggestions(true): setShowSuggestions(false);
            
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
        setSearchText(event.target.value);
        setShowResults(false);
        setIsTyping(true); 
       // setApiResults(apiInitial)
        setShowSuggestions(false);  //user has started typing - don't show suggestions until we have results   
    }

    //submit handler 
    const submitHandler = (event: any) => {
        event.preventDefault();        
        setShowSuggestions(false); // user has submitted an entry, do not show any suggestions 
        clearInterval(searchTimeout);
        searchCards(searchText, true, false);
    }

    //click handler
    const clickHandler = (event: any) => {  
        if('name' in event.target.dataset) {
        
            //show the add cards module
            if(event.target.matches('img')){
                if('type' in event.target.dataset) {
                    if(event.target.dataset.type == 'print'){
                        //show modole to add to collection
                        return;
                    }
                }
            }
            const cardName = event.target.dataset.name;            
            setShowSuggestions(false);                    
            setSearchText(cardName);            
            searchCards(cardName, true, false, true);     
        }
    }

    //changes to oposite
    const focusHandler = () => {            
        setisFocused(!isFocused);                
    }

    const getCardSets = () => {
        console.log('getting card sets');
        //setCardSets([{name:'test', code:'afr', released_at:'2021-10-29'}]);
        const endpoint = '/api/scryfall/sets';
        fetch(endpoint)
        .then(response => response.json())
        .then(setsList => 
            {
                setCardSets(setsList.data);
            }
        );

    }

    const setChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('set changed to: ', event.target.value);
        setSelectedSet(event.target.value);
    }

    //get the sets on load
    useEffect(getCardSets,[false]); //can leave [] so it never updates, but setting false explicitely to remember it is not meant to update
    
    return (
        <>
            <h1>Add Cards</h1>
            <SearchByName 
                cardSearchText={searchText} 
                cardSearchHandler={searchHandler}
                focusHandler={focusHandler}
                clickHandler={clickHandler}
                submitHandler={submitHandler}
                setChangeHandler={setChangeHandler}
                cards={apiResults.data && apiResults.data.map(card =>card.name)} //show the suggestion only when user hasn't picked one
                sets={cardSets}
                showSuggestions={showSuggestions}
                isTyping={isTyping}
                isFocused={isFocused}
            />

            <SearchResults 
                cards={apiResults.data} 
                showResults={showResults} 
                showPrints={showPrints}
                clickHandler={clickHandler}/>
        </>
    )
}