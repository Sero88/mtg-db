import {list} from '../types/list';
import { apiCard } from '../types/apiCard';
import Card from '../components/card';

type SearchProps = {
    cards: apiCard[] | null,    
    showResults: boolean,
    showPrints: boolean,
    clickHandler: (event:React.MouseEvent) => void,
}


export default function SearchResults({cards, showResults, showPrints, clickHandler}:SearchProps){    
    if(!showResults){
        return null;
    }

    //map the results
    let displayResults = [<p>No results found.</p>];
    if(cards) {
        displayResults = cards.map((card:apiCard, index) => {
            return(
                <li>
                    <Card data={card} key={index} showPrints={showPrints}/>
                </li>
            );
        })
    }
    
    return(    
        <div className="results">
            <h2>Cards:</h2>
            <ul onClick={clickHandler}>
                { displayResults }
            </ul>
            
        </div>
    );
}