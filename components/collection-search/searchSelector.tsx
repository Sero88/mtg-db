import { ReactElement } from 'react';
import { SelectorClasses } from '../../types/jsClasses';
import {SearchList} from './_searchList';
import styles from "../../styles/searchSelectorList.module.scss";
import { DisplayListItem } from '../../types/searchTypes';


type SearchListParentProp = {
    queryKey: string,
    canChangeIs: boolean,
    selectedItems: {name:string, is:boolean}[],
    classes: SelectorClasses,
    children: ReactElement,
    listItems: DisplayListItem[],
    selectorClickHandler: (event:React.MouseEvent) => void
}

export function SearchSelector({ canChangeIs, selectedItems, classes, children, listItems, queryKey,selectorClickHandler}:SearchListParentProp){

    return (
        <div className={styles.searchSelectorList}>
            <div className={styles.selectedListWrapper}>
                <div className={styles.selectedList}>
                    {
                        selectedItems.map( (typeObj, index) => {
                            return (
                                <div className={styles.itemObject} key={index}>
                                    <span className={styles.itemRemove + " " + classes.removeItem} data-index={index} data-key={queryKey}>x</span>
                                    { 
                                        canChangeIs && <span className={styles.itemIs + " " + classes.changeIs + ` ${typeObj.is ? styles.itemIsTrue : styles.itemIsFalse }`} data-index={index} data-key={queryKey}> 
                                            {typeObj.is ? "IS" : "NOT"}
                                        </span> 
                                    }
                                   <span className={styles.itemName}>{typeObj.name}</span>
                                </div>
                            );
                        })
                    }
                </div>
                {children}
            </div>

            <div className={styles.availableitems}>
                <p>Search:</p>
                <SearchList listItems={listItems} classes={classes} queryKey={queryKey} selectorClickHandler={selectorClickHandler}/>
            </div>
        </div>
    )
}