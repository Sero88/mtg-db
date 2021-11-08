
type SuggestionsProps = {
    cards: string[] | null,  
    limit: number
}

export default function SearchSuggestions({cards, limit}:SuggestionsProps){   

    const cardsLength = cards && cards.length ? cards.length : 0;
    const suggestions = [];

    if(!cards || cardsLength < 1){
        return <p><em>No matches</em></p>
    }

    for(let i=0; i<limit && i<cardsLength; i++){
        
        suggestions.push(<li key={i} data-name={cards[i]}>{cards[i]}</li>)
    }
 
    return(
        <ul>
            {suggestions}
        </ul>
    );
}