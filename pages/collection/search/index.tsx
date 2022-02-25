import { SearchName } from "../../../components/collection-search/name";
import React, { useState, useEffect } from "react";
import { SearchResults } from "../../../components/collection-search/results";
import { ResultsState } from "../../../types/resultsState";
import LoadingAnimation from '../../../components/loader-animation';
import styles from "../../../styles/collectionSearchResults.module.scss";
import { SearchText } from "../../../components/collection-search/text";
import { helpers } from "../../../util/helpers";
import { SearchTypes } from "../../../components/collection-search/types";
import { SearchColors } from "../../../components/collection-search/colors";
import { SelectorClasses } from "../../../types/jsClasses";
import { CardStatsType, SelectorListType } from "../../../types/searchTypes";
import {ColorConditionals} from "../../../util/enums/searchConditionals";
import { SearchStats} from "../../../components/collection-search/stats";
import { SearchSets } from "../../../components/collection-search/sets";
import { SearchRarity } from "../../../components/collection-search/rarity";
import { ApiCardHelper } from "../../../util/apiCardHelpers";
import { ApiSet } from "../../../types/apiSet";


export default function Search(){
    const searchEndpoint = '/api/collection/search/?action=searchQuery';
    //class names used for interactivity
    const jsClassNames = {
        selectorClasses: {
            itemWrapper: 'js-selector-item-wrapper',
            item: 'js-selector-item',
            removeItem: 'js-selector-remove-item',
            changeIs: 'js-selector-item-is',
            partialsToggle: 'js-selector-partials-toggle',
        } as SelectorClasses,
    }

    const fieldNames = {
        types: {
            partials: 'typePartials'
        },
        colors: {
            conditional:'colorConditionals',
            checkbox: 'colorValue'
        },
        cardName: 'cardName',
        cardText: 'cardText',
        cardRarity: {
            checkbox: 'colorRarity'
        }
    }

    const [searchQueryState, setSearchQueryState] = useState({
        cardName: '',
        cardText: '',
        cardTypes: { 
            queryKey:'cardTypes', 
            items: [], 
            conditionals: {
                allowPartials: false
            }
        } as SelectorListType,
        cardColors: {
            selected:[] as string[],
            conditional: ColorConditionals.exact as number
        },
        cardStats:{} as CardStatsType,
        isSearching: false,
        cardSets: {
            queryKey: 'cardSets',
            items: [],
        },
        cardRarity:{
            selected:[] as string[],
        }
    });

    const initialResultsState:ResultsState = {
        results: [],
        canShowResults: false, 
        sets: [] as ApiSet[]
    }
    
    const [resultsState, setResultsState] = useState(initialResultsState);

    const getScryfallSets = () => {
        ApiCardHelper.getAllSets()
            .then( setsList => {
                resultsState.sets = setsList.data;
                updateResultsState();
            });
    };

    useEffect(getScryfallSets,[]);

    const updateSearchQueryState = () => {
         //update the state, using prev state so it merges prev values and it doesn't overwrite it
        setSearchQueryState( prevState => {
            return {...prevState, ...searchQueryState}
        });
    }

    const updateResultsState = () => {
        setResultsState(prevState => {
            return {...prevState, ...resultsState}
        });
    }

    const searchForCards = async() => {
        const searchResults = await fetch(searchEndpoint, {
            method: 'POST', 
            body: JSON.stringify({
               searchQuery: searchQueryState
            })
        });

        const results =  await searchResults.json();

        if('status' in results && results.status == 'success'){

            resultsState.results = results.data;
            resultsState.canShowResults = true;
            updateResultsState();
            
            searchQueryState.isSearching = false;
            updateSearchQueryState();
        }
        
    };

    const submitHandler = (event:React.FormEvent) => {

        event.preventDefault();

        //update the isSearching flag
        searchQueryState.isSearching = true;
        updateSearchQueryState();
        
        searchForCards();
        
    };

    const onChangeHandler =  (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {  

        switch (event.target.name){
            case fieldNames.cardName:
            
                searchQueryState.cardName = event.target.value ;
            break;

            case fieldNames.cardText:
                searchQueryState.cardText = event.target.value;
            break;

            case fieldNames.types.partials:
                searchQueryState.cardTypes.conditionals.allowPartials = !searchQueryState.cardTypes.conditionals.allowPartials;
            break;

            case fieldNames.colors.conditional:
                searchQueryState.cardColors.conditional = parseInt(event.target.value) as number
            break;

            case fieldNames.colors.checkbox:
                const value = event.target.dataset.value ? event.target.dataset.value : '';
                const checked = 'checked' in event.target && event.target.checked ? event.target.checked : false;


                //if user chooses colorless remove the rest of the color selections or vise versa (cannot be color and colorless at the same time)
                if(checked && value == 'null'){
                    searchQueryState.cardColors.selected = [];
                } else {
                    const colorlessPos = searchQueryState.cardColors.selected.indexOf('null'); 
                    colorlessPos >=0 ? searchQueryState.cardColors.selected.splice(colorlessPos, 1) : false;
                }

                if(checked){
                    searchQueryState.cardColors.selected.push(value);
                } else {
                    const valueToRemove = searchQueryState.cardColors.selected.indexOf(value);
                    searchQueryState.cardColors.selected.splice(valueToRemove, 1);
                }
                
            break;

            case fieldNames.cardRarity.checkbox:
                const rarityValue = event.target.dataset.value ? event.target.dataset.value : '';
                const rarityChecked = 'checked' in event.target && event.target.checked ? event.target.checked : false;

                if(rarityChecked){
                    searchQueryState.cardRarity.selected.push(rarityValue);
                } else {
                    const valueToRemove = searchQueryState.cardRarity.selected.indexOf(rarityValue);
                    searchQueryState.cardRarity.selected.splice(valueToRemove, 1);
                }
            break;
        }
       
       updateSearchQueryState();
    
    };

    const textSearchSymbolClickHandler = (event: React.MouseEvent<Element, MouseEvent>) =>{
        const clickedElement = event.target as HTMLElement;

        //symbols
        if(helpers.parentHasSymbol(clickedElement)){
            //@ts-ignore
            searchQueryState.cardText += clickedElement.parentElement.dataset.symbol;
            updateSearchQueryState();
            
            //focus on the text input so user can easily modify it after adding the symbol
            const inputText = document.querySelector('input[name="cardText"]') as HTMLInputElement;
            inputText ? inputText.focus() : false;
        }

    };

    const formSectionClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        const clickedElement = event.target as HTMLElement;
        const queryKey = clickedElement.dataset.key ? clickedElement.dataset.key : null;

  
        if(!queryKey){
            return;
        }

        //remove item from selected list
        if(clickedElement.className.includes(jsClassNames.selectorClasses.removeItem)){
           const itemToRemove = clickedElement.dataset.index ? parseInt(clickedElement.dataset.index) : null;

           //verify we have item
           if(itemToRemove == null){
               return;
           }

           //@ts-ignore - it matches the query key so TS can ignore safely
           searchQueryState[queryKey].items.splice(itemToRemove, 1);
           updateSearchQueryState();
        }

        //change is/not
        else if(clickedElement.className.includes(jsClassNames.selectorClasses.changeIs)){
            const itemToChange = clickedElement.dataset.index ? parseInt(clickedElement.dataset.index) : null;
             //verify we have item
            
             if(itemToChange == null){
                return;
            }

            //@ts-ignore - it matches the query key so TS can ignore safely
            searchQueryState[queryKey].items[itemToChange].is = !searchQueryState[queryKey].items[itemToChange].is;
            updateSearchQueryState();
        }

    }

    const statsChangeHandler =  (event: React.ChangeEvent<HTMLDivElement>) => {  
        const currentStat =  event.currentTarget.dataset.name;
       
        //verify we have stat name
        if(!currentStat){
            return null;
        }

        //get the elements
        const conditionalSelect = document.querySelector(`.js-${currentStat}-conditional`) as HTMLSelectElement;
        const statValueElement = document.querySelector(`.js-${currentStat}-value`) as HTMLInputElement;

        //get the element values
        const conditionalValue = conditionalSelect ? conditionalSelect.value : '';
        const statValue = statValueElement ? statValueElement.value : '';

        //set the query state with value data
        searchQueryState.cardStats[currentStat] = {type: currentStat, conditional: parseInt(conditionalValue)};

        //value is optional - those without a value won't be processed, but conditional can still be changed by the user
        statValue ? searchQueryState.cardStats[currentStat].value = statValue : false;

        updateSearchQueryState();
    }


    const selectorClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        const clickedElement = event.currentTarget as HTMLElement;
        const queryKey = clickedElement.dataset.key ? clickedElement.dataset.key : null;
  
        if(!queryKey){
            return;
        }

        //add from avaialable types list to selected list
        if(clickedElement.className.includes(jsClassNames.selectorClasses.itemWrapper)){
            const uri = clickedElement.dataset.image?? '';
            const item = {name:clickedElement.dataset.name, value:clickedElement.dataset.value, is:true, uri }
            //@ts-ignore - it matches the query key so TS can ignore safely
            searchQueryState[queryKey].items.push(item);
            updateSearchQueryState();
        }
    }



    return (
    <>
        <div className="searchForm">
            <h1>Search Collection</h1>
            <form action="search/results/" onSubmit={submitHandler} className={styles.searchForm}>
                <div className="form-section">
                    <SearchName changeHandler={onChangeHandler} fieldName={fieldNames.cardName} fieldValue={searchQueryState.cardName}/>
                </div>

                <hr />

                <div className={styles.searchTextSection + " form-section"}>
                    <SearchText changeHandler={onChangeHandler} clickHandler={textSearchSymbolClickHandler} text={searchQueryState.cardText} fieldName={fieldNames.cardText}/>
                </div>

                <hr />

                <div className={styles.searchTypeSection + " form-section"} onClick={formSectionClickHandler}>
                <label>Types</label>
                    <SearchTypes 
                        selectedItems={searchQueryState.cardTypes.items} 
                        queryKey={searchQueryState.cardTypes.queryKey}
                        classes={jsClassNames.selectorClasses}
                        allowPartials={searchQueryState.cardTypes.conditionals.allowPartials ?? false}
                        partialsHandler={onChangeHandler}
                        partialsName={fieldNames.types.partials}
                        selectorClickHandler={selectorClickHandler}
                    />
                </div>

                <hr />

                <div className={styles.searchColorsSection + " form-section"} >
                    <label>Colors</label>
                    <SearchColors
                        selectedItems={searchQueryState.cardColors.selected}
                        selectedConditional={searchQueryState.cardColors.conditional}
                        changeHandler={onChangeHandler}
                        conditionalName={fieldNames.colors.conditional}
                        checkboxFieldName={fieldNames.colors.checkbox}
                    />
                </div>

                <hr />

                <div className={styles.statsSection + " form-section"} >
                    <label>Stats</label>
                    <SearchStats
                        cardStats={searchQueryState.cardStats}
                        changeHandler={statsChangeHandler}
                      />
                </div>

                <hr />

                <div className={styles.searchTypeSection + " form-section"} onClick={formSectionClickHandler}>
                <label>Sets</label>
                    <SearchSets 
                        selectedItems={searchQueryState.cardSets.items} 
                        queryKey={searchQueryState.cardSets.queryKey}
                        classes={jsClassNames.selectorClasses}
                        selectorClickHandler={selectorClickHandler}
                        apiSets={resultsState.sets}
                    />
                </div>

                <hr />

                <div className={styles.searchTypeSection + " form-section"}>
                <label>Rarity</label>
                    <SearchRarity
                        selectedItems={searchQueryState.cardRarity.selected}
                        changeHandler={onChangeHandler}
                        checkboxFieldName={fieldNames.cardRarity.checkbox}
                    />
                </div>
               
                <input type="submit" value="Search"/>
            </form>  
        </div>
        
        {searchQueryState.isSearching 

            ? <LoadingAnimation />
            : (
                <div className="results">
                    <SearchResults 
                        resultsState={resultsState} 
                        apiSets={resultsState.sets}
                    />
                </div>
            )
        
        }
    </>
    );
}