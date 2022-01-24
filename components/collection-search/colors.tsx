import { useEffect, useState } from "react";
import { SelectorClasses } from "../../types/jsClasses";
import { SymbolType } from "../../types/symbol";
import { DisplayListItem } from "../../types/searchTypes";
import { helpers } from "../../util/helpers";
import {ColorConditionals} from "../../util/enums/colorEnums";
import styles from "../../styles/colorSearch.module.scss";

type ColorSearchProps = {
    selectedItems: {name:string, is:boolean}[],
    queryKey:string,
    conditionalName:string,
    conditionalHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    selectorClickHandler:  (event:React.MouseEvent) => void,
    classes: SelectorClasses,
}

export function SearchColors({selectedItems, classes, queryKey, conditionalHandler, conditionalName,selectorClickHandler}:ColorSearchProps){
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
               
                  //todo remove after testing 👇
                  console.log('symbols', symbols );
                  //todo remove after testing 👆
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

    const colorNames = colors.map( color => color.name)

    return (
        <div>
            <div className={styles.colorChoices}>
                {
                    colors.map((color:DisplayListItem, index:number) => {
                        return (
                            <label key={index}>
                            <input type="checkbox" value={color.value} />
                            {helpers.getDisplayItemImage(color)}
                            </label>
                        );

                    })
                }
            </div>
            

            <select name={conditionalName}>
                <option value={ColorConditionals.exact}>Exactly these colors</option>
                <option value={ColorConditionals.include}>Including these colors</option>
                <option value={ColorConditionals.atMost}>At most one of these colors</option>
            </select>
        </div>
        
    );
}