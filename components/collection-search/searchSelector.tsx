import { ReactElement } from 'react';
import { CardTypeClasses } from '../../types/jsClasses';
import {SearchList} from './_searchList';

type SearchListParentProp = {
    styles:any
    canChangeIs: boolean,
    selectedItems: {name:string, is:boolean}[],
    classes: CardTypeClasses,
    children: ReactElement,
    listItems: string[]
}
export function SearchSelector({styles, canChangeIs, selectedItems, classes, children, listItems}:SearchListParentProp){
    return (
        <div className={styles.searchTypes}>
            <div className={styles.selectedTypesListWrapper}>
                <div className={styles.selectedTypesList}>
                    {
                        selectedItems.map( (typeObj, index) => {
                            return (
                                <div className={styles.typeObject} key={index}>
                                    <span className={styles.typeRemove + " " + classes.removeItem} data-index={index}>x</span>
                                    { 
                                        canChangeIs && <span className={styles.typeIs + " " + classes.changeIs + ` ${typeObj.is ? styles.typeIsTrue : styles.typeIsFalse }`} data-index={index}> 
                                            {typeObj.is ? "IS" : "NOT"}
                                        </span> 
                                    }
                                    <span className={styles.typeName}>{typeObj.name}</span>
                                </div>
                            );
                        })
                    }
                </div>
                {children}
            </div>

            <div className={styles.availableTypes}>
                <p>Search types in collection:</p>
                <SearchList list={listItems} itemClass={classes.item}/>
            </div>
        </div>
    )
}