// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CollectionCardType } from '../../types/collectionCard';
import styles from '../../styles/results.module.scss'
import { helpers } from '../../util/helpers';
import Card from '../../components/collectionCard';
import { ResultsState } from '../../types/resultsState';
import { CollectionCardModal } from '../collection-card-modal';
import { useState } from 'react';
import { cardModalStateType } from '../../types/cardModal';

export function SearchResults({resultsState}:{resultsState:ResultsState}){
    const initalCardModalState = {
        showModal: false,
        selectedCard: {}
    } as cardModalStateType;

    const [cardModal, setCardModal] = useState(initalCardModalState);
    const results = resultsState.results;
  
    const updateCardModalState = () => {
        setCardModal (prevState => {
            return { ...prevState, cardModal}
        });
    }

    const cardClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        const cardElement = event.currentTarget as HTMLElement;
        const oracleId = 'dataset' in cardElement
            && 'id' in cardElement.dataset
            ? cardElement.dataset.id 
            : '';

        if(!oracleId){
            return {}
        }

        for(const card of results){
            if(card.oracleId == oracleId){
                cardModal.selectedCard = card;
                updateCardModalState();
                break;
            }
        }
    }

    const cards = results.length 
        ? results.map((card:CollectionCardType, index) => {
            return(
                <li id={helpers.convertNameToId(card.name)} className={styles.cardWrapper} key={index}>
                    <Card
                        data={card}
                        clickHandler={cardClickHandler}
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
                    <p>Results({results.length})</p>

                    <ul className={styles.resultsList}>
                        { cards }
                    </ul>
            
                </div>
                <CollectionCardModal 
                    cardModalState={cardModal}
                />
                </>
            )
            : null}
        </>
        
    );
}