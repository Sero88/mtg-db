import { ApiCard } from "../../types/apiCard";

type SearchResultsProps = {
    cardData: ApiCard[] | undefined
}

export const SearchResults = ({cardData}:SearchResultsProps) => {

    if(!cardData?.length){
        return <p>No card(s) found.</p>
    }
    
    return( 
        <>
            <h2>Search Results</h2>
            {cardData.map( (card:ApiCard) => {
                return <p>{card.name}</p>
            })}
        </>
    )
}