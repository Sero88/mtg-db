import SearchSuggestions from './search-suggestions';
import {apiCard} from '../types/apiCard';
import style from '../styles/search.module.scss';
import React from 'react';

type searchByNameProps = {
    cardSearchText: string,
    cardSearchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
    focusHandler: (event:React.FocusEvent<HTMLElement>) => void,
    clickHandler: (event:React.MouseEvent) => void,
    submitHandler: (event:React.FormEvent) => void,
    cards: string[] | null,
    isTyping: boolean,
    isFocused: boolean,
    showSuggestions: boolean
}
export default function SearchByName({cardSearchHandler, focusHandler, clickHandler, submitHandler, cardSearchText, cards, isTyping, isFocused, showSuggestions}: searchByNameProps){
    
    return (
        <div className={style.searchByName} onClick={clickHandler}>
            <form onSubmit={submitHandler}>
                <label>Card Set: 
                    <select>
                        <option>Test</option>
                    </select>
                </label>            
                <label>Card Name:
                    <input 
                        type="text" 
                        name="cardName" 
                        onChange={cardSearchHandler} 
                        onFocus={focusHandler} 
                        onBlur={focusHandler} 
                        value={cardSearchText}
                        autoComplete="off"
                    />

                </label>
            </form>
            {showSuggestions &&
                (<div>
                    <div className={style.searchSuggestions}>
                        <SearchSuggestions cards={cards} />
                    </div>
                </div>)
            }
        </div>
    );    
}