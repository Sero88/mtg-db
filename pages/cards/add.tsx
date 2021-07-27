import SearchByName from "../../components/add-search";
import { useState, useEffect } from "react";

export default function AddPage(){
    const[searchText, setSearchText] = useState("");

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }

    return (
        <>
            <h1>Add Cards</h1>
            <SearchByName 
                cardSearchText={searchText} 
                cardSearchHandler={searchHandler} 
            />
        </>
    )
}