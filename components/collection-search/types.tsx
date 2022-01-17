import { useEffect, useState } from "react";
import { CardTypeClasses } from "../../types/jsClasses";
import { SearchList } from "./_searchList";
import styles from "../../styles/searchTypes.module.scss";

type SearchTypeProps = {
    selectedTypes: {name:string, is:boolean}[],
    allowPartials: boolean,
    partialsHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    classes: CardTypeClasses,

}

export function SearchTypes({selectedTypes, classes, allowPartials, partialsHandler}:SearchTypeProps){
    const [types, setTypes] = useState([]);
    
    const getTypes = () => {
        const endpoint = '/api/collection/search?action=getTypes';
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                  if(response && 'status' in response && response.status == 'success'){
                    setTypes(response.data);
                  }
                }
            );
    };

    useEffect(getTypes,[]);

    return (
        <div className={styles.searchTypes}>
            <div className={styles.selectedTypesListWrapper}>
                <div className={styles.selectedTypesList}>
                    {
                        selectedTypes.map( (typeObj, index) => {
                            return (
                                <div className={styles.typeObject} key={index}>
                                    <span className={styles.typeRemove + " " + classes.removeItem} data-index={index}>x</span>
                                    <span className={styles.typeIs + " " + classes.changeIs + ` ${typeObj.is ? styles.typeIsTrue : styles.typeIsFalse }`} data-index={index}>
                                        {typeObj.is ? "IS" : "NOT"}
                                    </span>
                                    <span className={styles.typeName}>{typeObj.name}</span>
                                </div>
                            );
                        })
                    }
                </div>
                <label>
                    <input type="checkbox" className={classes.partialsToggle} checked={allowPartials} onChange={partialsHandler} name="typePartials"/>
                    Allow partials
                </label>
            </div>

            <div className={styles.availableTypes}>
                <p>Search types in collection:</p>
                <SearchList list={types} itemClass={classes.item}/>
            </div>
        </div>
    )
}