
import {useState, useEffect} from 'react';
import { SymbolType } from '../../types/symbol';
import styles from '../../styles/addSymbols.module.scss';

export function AddSymbol({currentText, clickHandler}:{currentText:string, clickHandler:(event: React.MouseEvent<Element, MouseEvent>) => void,}){
    const [symbols, setSymbols] = useState([]);

    const getSymbols = () => {
        const endpoint = '/api/scryfall/symbols';
        fetch(endpoint)
            .then(response => response.json())
            .then(symbols => setSymbols(symbols.data));
    };

    useEffect(getSymbols,[]); // [] empty so it never updates after load

    return(
        <div className="addSymbolsSection" onClick={clickHandler}>
            <p className="addSymbolToggle">+ Add Symbol</p>
            <dl className={styles.symbolsList}>
                {
                    symbols.map( (symbol:SymbolType, index) => {
                        return (
                            <div key={"dk-"+index} data-symbol={symbol.symbol}>
                                <dt>{symbol.symbol}: </dt>
                                <dd><img src={symbol.svg_uri} width={15} height={15} /> {symbol.english}</dd>
                            </div>
                        );
                    })
                }
            </dl>
        </div>
    )
}