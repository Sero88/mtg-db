// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CollectionCardType, Version } from '../../types/collectionCard';
import styles from '../../styles/results.module.scss'
import { helpers } from '../../util/helpers';
import Card from '../../components/collectionCard';
import { ResultsState } from '../../types/resultsState';
import { CollectionCardModal } from '../collection-card-modal';
import { useState } from 'react';
import { cardModalStateType } from '../../types/cardModal';
import { ApiSet } from '../../types/apiSet';
import { CollectionCard } from "../../util/collectionCard";

export function SearchResults({resultsState,apiSets}:{resultsState:ResultsState, apiSets:ApiSet[]}){
    const initalCardModalState = {
        showModal: false,
        selectedCard: {},
        selectedVersion: {},
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

                //get the selected card
                cardModal.selectedCard = card;
                
                //get the version that is currently being displayed
                const versions = 'versions' in card && card.versions ? card.versions : [];
                const {scryfallId} = CollectionCard.getCardImage(card);
                cardModal.selectedVersion = helpers.getVersion(versions, scryfallId);

                //update show modal state
                cardModal.showModal = true;
                updateCardModalState();
                break;
            }
        }
    }

    const versionClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {

        const versionElement = event.currentTarget as HTMLTableRowElement
        const versions = cardModal.selectedCard.versions ? cardModal.selectedCard.versions : [];
        const scryfallId = 'dataset' in versionElement
            && versionElement.dataset
            && 'id' in versionElement.dataset
            && versionElement.dataset.id
            ? versionElement.dataset.id
            : null;

        if(!scryfallId){
            return;
        }
        
        cardModal.selectedVersion = helpers.getVersion(versions, scryfallId);
        updateCardModalState();
    }

    const modalCloseClickHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        cardModal.showModal = false;
        updateCardModalState();
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

                {cardModal.showModal &&
                    <CollectionCardModal 
                        cardModalState={cardModal}
                        apiSets={apiSets}
                        versionClickHandler={versionClickHandler}
                        modalCloseClickHandler={modalCloseClickHandler}
                    />
                }
                </>
            )
            : null}
        </>
        
    );
}