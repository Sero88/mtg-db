import {list} from '../types/list';
import { apiCard } from '../types/apiCard';
import Card from '../components/card';
import {useState, useEffect} from 'react';


type SearchProps = {
    cards: apiCard[] | null,    
    showPrints: boolean,
    fetchedQuery: string,
    clickHandler: (event:React.MouseEvent) => void,
}


export default function SearchResults({cards, showPrints, clickHandler, fetchedQuery}:SearchProps){    
    const [collectionData, setCollectionData] = useState(['']); 
    const [showResults, setShowResults] = useState(false);

    function getCollectionData(cards){

        const searchCards = cards.map( card => {
            return card.id;
        } );

        console.log('search cards: ', searchCards);

        fetch('/api/collection/search',{
            method: 'POST',
            body: JSON.stringify({cards:searchCards})
        })
        .then(response => response.json())
        .then(data => {
            setShowResults(true);                
        })
        .catch( e => {console.error(e)});
        
       
    }

    useEffect( () => {
        if(showPrints){
            getCollectionData(cards);
        }
    },[fetchedQuery]);                    
    

    const addCollection = (card) => {
        const endpoint = `/api/collection/update`;
        fetch(endpoint, {
            method: 'PUT', 
            body: JSON.stringify({
                card, 
                action: 'add'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    }

    const updateCollectionHandler = (event, card) => {
        console.log('updateCollectionHandler: ', card);
        if(!card){
            console.error('Missing card parameter, unable to modify collection.');
            return;
        }
        
        const target = event.currentTarget;
        if(!('collection_menu_action' in target.dataset) ){
            return;
        }

        const action = target.dataset['collection_menu_action']
        //add functionality
        if(action == 'add'){
            addCollection(card);
        } else {

        }
   
    }
   

    //map the results
    let results = [<li key={1}>No results found.</li>];
    if(cards) {        
        results = cards.map((card:apiCard, index) => {
            return(
                <li key={index}>
                    <Card 
                        data={card} 
                        key={index} 
                        showPrints={showPrints}
                        collectionData={collectionData}
                        updateCollectionHandler={updateCollectionHandler}
                    />
                </li>
            );
        })
    }


    //show the results if it is not prints (general search query), show print results only after we query the db
    if( !showPrints || (showPrints && showResults) ){
        return(    
            <div className="results">
                <h2>Cards:</h2>
                <ul onClick={clickHandler}>
                    { results }
                </ul>            
            </div>
        );
    } else {
        return null;
    }
    
}