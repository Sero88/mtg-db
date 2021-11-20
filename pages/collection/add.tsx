import SearchByName from "../../components/search-by-name";
import React, {useState, useEffect } from "react";
import SearchResults from "../../components/search-results";
import {ApiResultsList} from "../../types/apiResultsList";
import {ApiSet} from "../../types/apiSet";
import LoaderAnimation from "../../components/loader-animation";
import {helpers} from '../../util/helpers';
import {useRouter} from 'next/router';

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

    type previousStateType = {
        query: string, 
        results: ApiResultsList,
        searchText: string,
        cardId: string,
        page: number
    }

    const prevInitialState:previousStateType = {
        query:  '',
        results: apiInitial,
        searchText: '', 
        cardId: '', 
        page: 0
    }
    const[searchText, setSearchText] = useState("");   
    const[apiResults, setApiResults] = useState(apiInitial);
    const[previousState, setPreviousState] = useState(prevInitialState);
    const[isTyping, setIsTyping] = useState(false);
    const[isFocused, setisFocused] = useState(false);
    const[showSuggestions, setShowSuggestions] = useState(false);
    const[showResults, setShowResults] = useState(false);
    const[fetchedQuery, setFetchedQuery] = useState('');
    const[showPrints, setShowPrints] = useState(false);
    const[cardSets, setCardSets] = useState<ApiSet[]>([]);
    const[selectedSet, setSelectedSet] = useState("");
    const[showLoader, setShowLoader] = useState(false);
    const[generalResultsPage, setGeneralResultsPage] = useState(0);

    //function to search cards
    const searchCards = (cardName:string, _showResults:boolean, _showSuggestions:boolean, _showPrints:boolean = false, _generalResultsPage = generalResultsPage) => {
        
        //user is no longer typing                 
        setIsTyping(false);     
        
        //we're switching from results to print results
        if((!showPrints && _showPrints)){
            const previousStateData:previousStateType = {
                query:  fetchedQuery,
                results: apiResults,
                searchText: searchText,
                cardId: helpers.convertNameToId(cardName),
                page: generalResultsPage
            }

            setPreviousState(previousStateData);
        }

        cardName = cardName && _showPrints
            ? `!"${cardName}"`
            : cardName;

        const set = selectedSet 
            ? ` set:${selectedSet},s${selectedSet},p${selectedSet}` 
            : '';


        console.log('_generalResultsPage: ', _generalResultsPage);

        const page = _generalResultsPage
            ? _generalResultsPage
            : 1;

            console.log('page: ', page);
        let endpoint = _showPrints 
            ? '/api/scryfall/cards/?order=released&unique=prints&query=' + encodeURIComponent(cardName + set)
            : '/api/scryfall/cards/?query=' + encodeURIComponent(cardName + set) + "&page=" + page;
        
        //fetch new data only if the new search query is different than what we already fetched
        if( endpoint != fetchedQuery ){

            setShowLoader(true);

            
            fetch(endpoint)
            .then(response => response.json())
            .then(data => 
                {          

                     //if the retrieved data is of only one card, query for the multiple prints that specific card
                    if('total_cards' in data && data.total_cards == 1 && !_showPrints){
                        if('data'in data && data.data[0]){
                            searchCards(data.data[0].name, true, false, true, 1);     
                        }

                        setShowLoader(false);
                        return;
                    }

                
                    //set the api results
                    setApiResults(data);  

                    //show suggestions
                    setShowSuggestions(_showSuggestions);                   
                    
                    setShowPrints(_showPrints); 

                    //set the new fetched query value
                    setFetchedQuery(endpoint);
                    
                    setShowLoader(false);
                    setGeneralResultsPage(page);
                    setShowResults(_showResults);
                                                                              
                }
            );
        } else { 
            showResults ? setShowResults(true) : setShowResults(false);
            showSuggestions ? setShowSuggestions(true): setShowSuggestions(false);            
        }
        
    }

    const changeSearchText = (newText: string)=>{
        setSearchText(newText);
        //clear the pagination
        setGeneralResultsPage(0);
    }

    //search handler
    const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {  

        clearInterval(searchTimeout);
        if(event.target.value){
            searchTimeout = setTimeout(
                ()=>searchCards(event.target.value, false, true), 1200 
            );        
        }
        changeSearchText(event.target.value);
        setShowResults(false);
        setIsTyping(true); 
       // setApiResults(apiInitial)
        setShowSuggestions(false);  //user has started typing - don't show suggestions until we have results   
    }

    //submit handler 
    const submitHandler = (event: React.FormEvent<Element>) => {
        event.preventDefault();        
        setShowSuggestions(false); // user has submitted an entry, do not show any suggestions
        clearInterval(searchTimeout);
        searchCards(searchText, true, false, false, 0);
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
            setShowSuggestions(false);                    
            changeSearchText(cardName);            
            searchCards(cardName, true, false, true,1);     
        }
    }

    //changes to oposite
    const focusHandler = () => {            
        setisFocused(!isFocused);                
    }

    const getCardSets = () => {
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
        setSelectedSet(event.target.value);
        //setGeneralResultsPage(0);
    }

    const backButtonHandler = (event: React.MouseEvent<Element, MouseEvent>) => {  
        setShowPrints(false);
        setApiResults(previousState.results);
        setSearchText(previousState.searchText);
        setFetchedQuery(previousState.query);
        setGeneralResultsPage(previousState.page);
    }

    const updatePageResults = ( page: number) => {
        page !== 0 && searchCards(searchText, true, false, false, page);
    }

    //get the sets on load
    useEffect(getCardSets,[false]); //can leave [] so it never updates, but setting false explicitely to remember it is not meant to update

    useEffect(function(){
       previousState.cardId && !showPrints ? window.location.href = router.pathname+"#" + previousState.cardId : '';
    },[apiResults])

    
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

            {showLoader &&
                <LoaderAnimation/>
            }

            {showResults && 
                <SearchResults 
                    apiResults={apiResults} 
                    showPrints={showPrints}
                    clickHandler={clickHandler}
                    backButtonHandler={backButtonHandler}
                    fetchedQuery={fetchedQuery}
                    updatePageResults={updatePageResults}
                    generalResultsPage={generalResultsPage}/>
            }
        </>
    )
}