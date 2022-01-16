import { useEffect, useState } from "react";
import { CardTypeClasses } from "../../types/jsClasses";
import { SearchList } from "./_searchList";

type SearchTypeProps = {
    selectedTypes: {name:string, is:boolean}[]
    classes: CardTypeClasses
}

export function SearchTypes({selectedTypes, classes}:SearchTypeProps){
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
        <div className="TypesSection">
            <label>Types</label>
            <div className="selectedTypes">
                {
                    selectedTypes.map( (typeObj, index) => {
                        return (
                            <div className="typeObject" key={index}>
                                <span className={classes.removeItem} data-index={index}>X</span>
                                <span className={classes.changeIs} data-index={index}>{typeObj.is ? "IS" : "NOT"}</span>
                                <span>{typeObj.name}</span>
                            </div>
                        );
                    })
                }
            </div>

            <div className="availableTypes">
                <p>Available types in collection:</p>
                <SearchList list={types} itemClass={classes.item}/>
            </div>
        </div>
    )
}