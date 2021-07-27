
type list = [
    data: [],
    has_more: boolean,
    next_page: string,
    total_cards: number,
    warnings: []
]
export default function SearchResults({results, ...props}:list[]){

    
    return(
        <div className="results">
            
        </div>
    );
}