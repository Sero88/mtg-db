import { useEffect, useState } from "react";
import { SelectorClasses } from "../../types/jsClasses";
import { SymbolType } from "../../types/symbol";
import { DisplayListItem } from "../../types/searchTypes";
import { helpers } from "../../util/helpers";
import {ColorConditionals} from "../../util/enums/searchConditionals";
import styles from "../../styles/colorSearch.module.scss";

type ColorSearchProps = {
    conditionalName:string,
    changeHandler:  (event: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => void,
    checkboxFieldName: string,
    selectedItems: string[],
    selectedConditional: number,
}

export function SearchColors({changeHandler, conditionalName, checkboxFieldName, selectedItems, selectedConditional}:ColorSearchProps){
    const [colors, setColors] = useState([] as DisplayListItem[]);
    
    const getSymbols = () => {
        const endpoint = '/api/scryfall/symbols';
        fetch(endpoint)
            .then(response => response.json())
            .then(symbols => {

                const availableColors = []  as DisplayListItem[];

                //verify we have symbols
                if((!('data' in symbols) && !symbols.data.length ) ) {
                    return [];
                }
               
                symbols.data.forEach( (symbol:SymbolType) => {
                   
                    // is a mana symbol, has a loose variant (example G for green), is at least one color, or if it doesn't have a color the name is colorless
                    if(symbol.represents_mana && symbol.cmc == 1 && ('loose_variant' in symbol && symbol.loose_variant) && (symbol.colors.length == 1 || (symbol.colors.length == 0 && symbol.english.includes('colorless'))) ){

                        const value = symbol.colors.length > 0 ? symbol.colors[0] : 'null';
                        availableColors.push({uri: symbol.svg_uri, name: symbol.english.replace(/one|mana|\s/ig, ''), value});
                    }
                });

                setColors(availableColors);
            });
    };

    useEffect(getSymbols,[]);

    return (
        <div>
            <div className={styles.colorChoices}>
                {
                    colors.map((color:DisplayListItem, index:number) => {
                        return (
                            <label key={index}>
                                <input type="checkbox" data-value={color.value} checked={selectedItems.includes(color.value)} name={checkboxFieldName} onChange={changeHandler}/>
                                {helpers.getDisplayItemImage(color, 20)}
                            </label>
                        );

                    })
                }
            </div>

            {
                // only display conditionals when users chooses colors
                !selectedItems.includes('null') &&
                <select name={conditionalName} value={selectedConditional} onChange={changeHandler}>
                    <option value={ColorConditionals.exact}>Exactly these colors</option>
                    <option value={ColorConditionals.include}>Including these colors</option>
                    <option value={ColorConditionals.atLeast}>At least one of these colors</option>
                </select>
            }
            
        </div>
        
    );
}