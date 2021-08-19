import {list} from '../types/list';
import {apiCard} from '../types/apiCard';
import {useEffect} from 'react';
import style from '../styles/suggestion-box.module.scss';

type SuggestionsProps = {
    cards: string[] | null,  
}

export default function SearchSuggestions({cards}:SuggestionsProps){   
    return(
        <ul>
            {
                cards && (cards.map((card, index) => {
                    return (<li key={index} data-name={card}>{card}</li>);
                }))            
             }
        </ul>
    );
}