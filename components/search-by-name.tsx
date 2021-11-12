import SearchSuggestions from './search-suggestions';
import {ApiSet} from '../types/apiSet';
import styles from '../styles/search.module.scss';
import React from 'react';
import {allowedSets} from '../util/allowedSets'


type searchByNameProps = {
    cardSearchText: string,
    cardSearchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
    focusHandler: (event:React.FocusEvent<HTMLElement>) => void,
    clickHandler: (event:React.MouseEvent) => void,
    submitHandler: (event:React.FormEvent) => void,
    setChangeHandler: (event:React.ChangeEvent<HTMLSelectElement>) => void
    cards: string[] | null,
    sets: ApiSet[],
    isTyping: boolean,
    isFocused: boolean,
    showSuggestions: boolean
}

export default function SearchByName(
    {
        cardSearchHandler, 
        focusHandler, 
        clickHandler, 
        submitHandler, 
        setChangeHandler,
        cardSearchText, 
        cards,
        sets,
        isTyping, 
        isFocused, 
        showSuggestions
    }:searchByNameProps){
    
    return (
        <div className={styles.searchByName} onClick={clickHandler}>
            <form onSubmit={submitHandler}>
                <label className={styles.setField}><span>Card Set: </span>
                    <select onChange={setChangeHandler}>
                        <option value="">All sets</option>
                        {(
                            sets.map( (set:ApiSet, index:number) => {
                                if(!set.digital && allowedSets.includes(set.set_type) ){
                                    return  (<option value={set.code} key={index}>{set.name}</option>);
                                }                              
                            })
                        )}
                    </select>
                </label>            
                <label className={styles.nameField}><span>Card Name:</span>
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
                    <div className={styles.searchSuggestions}>
                        <span className={styles.suggestionsTitle}>Card Suggestions</span>
                        <SearchSuggestions cards={cards} limit={5} />
                    </div>
                </div>)
            }
        </div>
    );    
}