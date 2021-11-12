import { ApiCard } from '../types/apiCard';
import { CollectionCardType } from '../types/collectionCard';
import Card from '../components/card';
import {useState, useEffect} from 'react'; 
import styles from '../styles/results.module.scss';


type SearchProps = {
    cards: ApiCard[],    
    showPrints: boolean,
    fetchedQuery: string,
    clickHandler: (event:React.MouseEvent) => void,
}

type CollectionData = {
    [key:string]: number
};

export default function SearchResults({cards, showPrints, clickHandler, fetchedQuery}:SearchProps){    
    const [collectionData, setCollectionData] = useState<CollectionData>({}); 
    const [showResults, setShowResults] = useState(false);

    function getCollectionData(cards:ApiCard[]){

        if(!cards || cards.length == 0){
            return;
        }

        const searchCards = cards.map( card => {
            return card.id;
        } );

        const endpoint = '/api/collection/search?cardIds='+JSON.stringify(searchCards)+'&action=searchIds';
        fetch(endpoint,{
            method: 'GET',
        })
        .then(response => response.json())
        .then(apiResponse => {
            if( !('status' in apiResponse) || (('status' in apiResponse) && apiResponse.status != 'success') ) {
                return false;
            }

            //construct collection data
            apiResponse.data.forEach( (collectionObj:CollectionCardType) => {
                const quantity = collectionObj.quantity ?? 0;
                collectionData[collectionObj.scryfallId] = quantity;
            });

            setCollectionData({...collectionData}); 
            setShowResults(true);     
                    
        })
        .catch( e => {console.error(e)});
    }

    useEffect( () => {
        if(showPrints){
            getCollectionData(cards);
        }
    },[fetchedQuery]);                    
    
    const updateCollection = (card:ApiCard, action:string, quantity:number) => {
        const endpoint = `/api/collection/update`;
        fetch(endpoint, {
            method: 'PUT', 
            body: JSON.stringify({
                card, 
                action: action,
                quantity
            })
        })
        .then(response => response.json())
        .then(response => {
            if('status' in response && response.status == 'success'){
                collectionData[response.data.scryfallId] =  response.data.quantity;
                setCollectionData({...collectionData});
            }
        })
    }

    const updateCollectionHandler = (event: React.MouseEvent<Element, MouseEvent>, card:ApiCard, quantity:number) => {

        if(!card){
            console.error('Missing card parameter, unable to modify collection.');
            return;
        }
        
        const target = event.currentTarget as HTMLElement;
        if(!('collection_menu_action' in target.dataset) ){
            return;
        }

        const action = target.dataset['collection_menu_action']
        //add functionality
        if(action == 'add'){
            updateCollection(card, 'add', quantity);
        } else {
           quantity ? updateCollection(card, 'remove', quantity) : false;
        }
    }
   
    let results = [<li key={1}>No results found.</li>];
    let showCount = false;
    if(cards) {    
        showCount = true;    
        results = cards.map((card:ApiCard, index) => {
            return(
                <li className={styles.cardWrapper} key={index}>
                    <Card 
                        data={card} 
                        key={index} 
                        showPrints={showPrints}
                        quantity={collectionData[card.id]}
                        updateCollectionHandler={updateCollectionHandler}
                    />
                </li>
            );
        })
    }

    //show the results if it is not prints (general search query), show print results only after we query the db
    if( !showPrints || (showPrints && showResults) ){
        return(    
            <div className={styles.resultsWrapper}>
                <h2>{showCount && `Cards (${results.length}):`}</h2>
                <ul onClick={clickHandler} className={styles.resultsList}>
                    { results }
                </ul>            
            </div>
        );
    } else {
        return null;
    }
    
}