import { GetServerSideProps } from 'next';
import { CardCollection } from '../../../models/cardCollection';
import { SearchObject } from '../../../types/searchTypes';
import { CollectionCardType } from '../../../types/collectionCard';
import styles from '../../../styles/results.module.scss'
import { helpers } from '../../../util/helpers';
import Card from '../../../components/collectionCard';

type queryObject = {
    [key:string]: any
}

let query: queryObject; 

function getQueryValue(name:string){
    const value = query
        && name in query
        ? query[name]
        : '';
    return value;
}

export const getServerSideProps:GetServerSideProps = async (context) => {
 
    //db check connection
    const cardCollection = new CardCollection();
    const isConnected = await cardCollection.dbConnect();

    if(!isConnected){
        return {props:{error:'unable to connect to db'}};
    }

    const searchObject:SearchObject = {};
    query = context.query;

    //get form data
    searchObject.cardName = getQueryValue('cardName');

    const cards = await cardCollection.getCards(searchObject);
  
    //todo remove after testing 👇
    console.log('card results: ', cards);
    //todo remove after testing 👆
    
    const props = {results: cards.data};
    return {props};
}


export default function SearchResults({results}:{results:CollectionCardType[]}){

    const cards = results.map((card:CollectionCardType, index) => {
        return(
            <li id={helpers.convertNameToId(card.name)} className={styles.cardWrapper} key={index}>
                <Card
                    data={card}
                />
            </li>
        );
    })
    return(
        <>
            <h1>Search Results</h1>
            <div>
                {results.length
                 ? (
                    <>
                        <p>Cards({results.length})</p>

                        <ul className={styles.resultsList}>
                            { cards }
                        </ul>
                    </>
                    )
                 : <p>No cards matched your search criteria</p>
                }
            </div>
        </>
    );
}