import {list} from '../types/list';

type SearchProps = {
    results: list,
}

export default function SearchResults({results}:SearchProps){    
    return(
        <div className="results">
            <h2>Cards:</h2>
            {
                results.data.map( (result, index) => {
                    return(
                        <p>{result.card}</p>
                    )
                })
            }
        </div>
    );
}