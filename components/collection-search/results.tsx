// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CollectionCardType } from '../../types/collectionCard';
import styles from '../../styles/results.module.scss'
import { helpers } from '../../util/helpers';
import Card from '../../components/collectionCard';
import { ResultsState } from '../../types/resultsState';

export function SearchResults({resultsState}:{resultsState:ResultsState}){


    //todo remove after testing 👇
    console.log('type of', typeof resultsState );
    //todo remove after testing 👆

    const results = resultsState.results;

    const cards = results.length 
        ? results.map((card:CollectionCardType, index) => {
            return(
                <li id={helpers.convertNameToId(card.name)} className={styles.cardWrapper} key={index}>
                    <Card
                        data={card}
                    />
                </li>
            );
        })
        :  <li key={1}>No cards matched your search criteria.</li>;
 
    return(
        <>
            {resultsState.canShowResults
            ? (
                <>
                <h1>Search Results</h1>
                <div>
                    <p>Cards({results.length})</p>

                    <ul className={styles.resultsList}>
                        { cards }
                    </ul>
            
                </div>
                </>
            )
            : null}
        </>
        
    );
}