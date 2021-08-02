import SearchByName from "../../components/add-search";
import { useState } from "react";
import SearchResults from "../../components/search-results";
import {list} from "../../types/list";

let searchTimeout: NodeJS.Timeout;

//function to search cards
function searchCards(cardName:string){
    fetch('/api/scryfall/?cardName=' + cardName)
    .then(response => response.json())
    .then(data => console.log(data));
}

export default function AddPage(){
    const[searchText, setSearchText] = useState("");

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        clearInterval(searchTimeout);
        searchTimeout = setTimeout(()=>searchCards(e.target.value), 1250 );        

        setSearchText(e.target.value);
    }

    const apiResults:list = {
        data: [{card:'cardName'}, {card:'secondCard'}],
        has_more: false,
        next_page: 'test_next url',
        total_cards: 20,
        warnings: ['none'],
    }

    return (
        <>
            <h1>Add Cards</h1>
            <SearchByName 
                cardSearchText={searchText} 
                cardSearchHandler={searchHandler} 
            />

            <SearchResults results={apiResults} />
        </>
    )
}