import React, { useEffect, useState, useRef } from 'react';
import Loader from '../components/loader-animation';
import { CollectionCardType, Version } from '../types/collectionCard';

type failedUpdate = {
    card: CollectionCardType,
    version: Version
}

export function UpdatePrices({updateDoneCallback}:{updateDoneCallback:(date:Date)=>void}) {

    const [inProgress, setInProgress] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [collectionData, setCollectionData] = useState([]);
    const [scryfallMappedData, setScryfallMappedData] = useState(new Map());
    const [failedToUpdateCards, setFailedToUpdateCards] = useState([] as failedUpdate[])
    const stateRef = useRef();

    const retrieveCollection = async () => {
        const response = await fetch('/api/collection/')
        const collectionCards = await response.json()

        setCollectionData(collectionCards);
    }

    const retrieveScryfall = async () => {
        const bulkResponse= await fetch('https://api.scryfall.com/bulk-data/default-cards/?format=json');
        const bulkOptions = await bulkResponse.json();

        const cardResponse = await fetch(bulkOptions.download_uri);
        const scryfallCards = await cardResponse.json();

        //for testing w/o calling api
        // const scryfallCards = [
        //     {
        //         id:"42ba0e13-d20f-47f9-9c86-2b0b13c39ada",
        //         prices: { 
        //             eur: "0.45",
        //             eur_foil:"2.29",
        //             tix: "0.02",
        //             usd: "0.32",
        //             usd_etched: null,
        //             usd_foil: "115.25"
        //         }
        //     }
        // ]

        const mappedCards = new Map();
        for(let i=0; i < scryfallCards.length; i++){
            mappedCards.set(scryfallCards[i].id, scryfallCards[i].prices);
        }

        setScryfallMappedData(mappedCards);
    }

    const updateCollection = async() => {
        // @ts-ignore
        const {collectionData,  scryfallMappedData} = stateRef.current
        
        for(const card of collectionData){
            for(const version of card.versions){
                const newPrices = scryfallMappedData.get(version.scryfallId)
                newPrices 
                    ? (await fetch('/api/collection/update',{
                        method:'put',
                        body: JSON.stringify({scryfallId: version.scryfallId, prices: newPrices, action:'updatePrices'})
                    }))

                    : failedToUpdateCards.push({card, version});
            }
        }

        setFailedToUpdateCards(failedToUpdateCards);
    }

    const prepareCollection = async () => {
        const response = await fetch('/api/collection/')
        const collectionCards = await response.json()

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(collectionCards)));
        element.setAttribute('download', 'collection');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

        updateDoneCallback(new Date());
    }

    const initialSteps = [
        {name:'Retrieving collection data', completed: false, callback: async() => retrieveCollection()},
        {name:'Getting new card data', completed: false, callback: async() =>retrieveScryfall()},
        {name:'Updating collection data with new prices', completed: false, callback: () => updateCollection()},
        {name:'Preparing data for download', completed: false, callback: () => prepareCollection()}
    ]

    const [steps] = useState(initialSteps);
    

    useEffect( () => {
        //update stateRef so callbacks can have access to the data
        // @ts-ignore
        stateRef.current = {collectionData, scryfallMappedData}

        if(currentStep == steps.length){
            setInProgress(false);
        }
        else if(inProgress && currentStep < steps.length){
            
            steps[currentStep].callback()
                .then(() => {
                    setCurrentStep(currentStep+1)
                })
            
        }
    
    }, [currentStep, inProgress]);
   
    const createdFailedCardList = () => {
        return(
            failedToUpdateCards.map( cardObj => <li>{cardObj.card.name} ({cardObj.version.set})</li>)
        )
    }

    const showErrors = () => {
        if(failedToUpdateCards.length > 0){
            return(
                <>
                    <p>{failedToUpdateCards.length} card(s) failed to update:</p>
                    {createdFailedCardList()}
                </>
            
            )
        }
        else {
            return <p>Collection updated successfully with no errors.</p>
        }
    }

    let showSteps = [];
    for(let i = 0 ; i<=currentStep && i < steps.length; i++){
        showSteps.push(<li key={i}>{steps[i]?.name}</li>)
    }

    return(
        <>
            {
                inProgress && 
                <>
                    {showSteps} 
                    <Loader />
                </>
            }

            {
                currentStep == steps.length
                ? (<>
                    
                    {showSteps} 
                    <h3>Price update results:</h3>
                    {showErrors()} 
                    </>)
                : <button onClick={async() => setInProgress(true)} disabled={inProgress}>Update Prices And Download Data</button>
            }
        </>
    )
}