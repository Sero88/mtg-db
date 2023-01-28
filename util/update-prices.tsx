import React, { useEffect, useState, useRef, ReactElement } from 'react';
import Loader from '../components/loader-animation';
import { CollectionCardType, Version } from '../types/collectionCard';

type failedUpdate = {
    card: CollectionCardType,
    version: Version
}

type UpdateCard = {
    total: number,
    current: number,
}

export function UpdatePrices({updateDoneCallback}:{updateDoneCallback:(date:Date)=>void}) {

    const [inProgress, setInProgress] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [collectionData, setCollectionData] = useState([]);
    const [scryfallMappedData, setScryfallMappedData] = useState(new Map());
    const [failedToUpdateCards, setFailedToUpdateCards] = useState([] as failedUpdate[])
    const [cardUpdate, setCardUpdate] = useState({total: 0, current: 0} as UpdateCard)
    const stateRef = useRef();

    const retrieveCollection = async () => {
        const response = await fetch('/api/collection/')
        const collectionCards = await response.json()

        const versionCountResponse = await fetch('api/collection/versions?action=count')
        const versionCount = await(versionCountResponse.json());


        setCollectionData(collectionCards);
        setCardUpdate((prev) => ({...prev, total: versionCount?.data}));
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
                
                setCardUpdate((prevState)=>{ return {...prevState, current: prevState.current + 1} })
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
        {id: 'retrieveCollection', name:'Retrieving collection data', completed: false, callback: async() => retrieveCollection()},
        {id: 'retrieveScryfall', name:'Getting new card data', completed: false, callback: async() =>retrieveScryfall()},
        {id: 'updateCollection', name:'Updating collection data with new prices', completed: false, callback: () => updateCollection()},
        {id: 'prepareDownload', name:'Preparing data for download', completed: false, callback: () => prepareCollection()}
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
            <ul>
                {failedToUpdateCards.map( cardObj => <li>{cardObj.card.name} ({cardObj.version.set})</li>)}
            </ul>
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

        const stepName = steps[i]?.name
        let stepInfo:ReactElement | string = '';

        if(steps[i].id == 'updateCollection'){
           stepInfo = <ul><li>{`Card ${cardUpdate.current} of ${cardUpdate.total}`}</li></ul>
        }
        
        showSteps.push(<li key={i}>{stepName}{stepInfo}</li>)
    }

    return(
        <>
            {
                currentStep == steps.length
                ? (<>
                    <h2>Updating</h2>
                    <ul>{showSteps}</ul>
                    <h3>Price update results:</h3>
                    {showErrors()} 
                    </>)
                : <button onClick={async() => setInProgress(true)} disabled={inProgress}>Update Prices And Download Data</button>
            }
        </>
    )
}