import {list} from '../types/list';
import { apiCard } from '../types/apiCard';
import Image from 'next/image';

type SearchProps = {
    cards: apiCard[] | null,    
    showResults: boolean
}

export default function SearchResults({cards, showResults}:SearchProps){    
    if(!showResults){
        return null;
    }

    console.log(cards);
    //map the results
    let displayResults = [<p>No results found.</p>];
    if(cards) {
        displayResults = cards.map((card:apiCard, index) => {
            return(
                <Image
                    src={card.image_uris.normal}
                    width={196}
                    height={273}
                    />
            );
        })
    }
    
    return(    
        <div className="results">
            <h2>Cards:</h2>
            { displayResults }
        </div>
    );
}