import { useEffect, useState } from "react";
import { SearchList } from "./_searchList";
export function SearchTypes(){
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
            <div className="selectedTypes">

            </div>

            <div className="availableTypes">
                <p>Available types in collection:</p>
                <SearchList list={types} />
            </div>
        </div>
    )
}