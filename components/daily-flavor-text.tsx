import { useEffect, useState } from "react";
import styles from '../styles/dailyFlavorText.module.scss';
import {Icon} from './font-awesome-icon';
import {ApiResponse} from '../types/apiResponse';

function isSuccessful(apiResponse:ApiResponse){
    return ('status' in apiResponse) || (('status' in apiResponse) && apiResponse.status != 'success');
}

type FlavorTextCard = {
    name: string,
    flavorText: string
}

function hasFlavorText(apiResponse:ApiResponse){
    const hasFlavorText = 
        "data" in apiResponse
        && 'cardFaces' in apiResponse.data
        && 'flavorText' in apiResponse.data.cardFaces[0]
        ? true 
        : false;

    return hasFlavorText;
}

function retrieveRandomFlavorText(apiResponse:ApiResponse):FlavorTextCard{
    const cardFaces = "data" in apiResponse
    && 'cardFaces' in apiResponse.data
    ? apiResponse.data.cardFaces
    : [];

    if(!cardFaces){
        return {name:'', flavorText:''};
    }

    const cardName = "name" in apiResponse.data && apiResponse.data.name ? apiResponse.data.name : '';


    const flavorTexts:string[] = [];
    

    cardFaces.forEach( face => {
        if('flavorText' in face && face.flavorText){
            flavorTexts.push(face.flavorText);
        }
    });

    return {
        name: cardName,
        flavorText: flavorTexts[Math.floor(Math.random() * flavorTexts.length)]
    }
}



export function DailyFlavorText(){
    function getFlavorText(){
        const endpoint = '/api/collection/search?action=dailyFlavorText';
        fetch(endpoint,{
            method: 'GET',
        })
        .then(response => response.json())
        .then(apiResponse => {
            if( !isSuccessful(apiResponse)) {
                return false;
            }
    
            setFlavorTextCard(retrieveRandomFlavorText(apiResponse));
                    
        })
        .catch( e => {console.error(e)});
    }


    const [flavorTextCard, setFlavorTextCard] = useState({name:'', flavorText:''});

    useEffect(getFlavorText,[false]); //can leave [] so it never updates, but setting false explicitely to remember it is not meant to update
    return(
        <div className={styles.dailyFlavorText}>
            <Icon icon="quoteLeft" />
            <span>{'flavorText' in flavorTextCard && flavorTextCard.flavorText}</span>
            <Icon icon="quoteRight" />
            <br/>
            <span className={styles.cardName}>{'name' in flavorTextCard && flavorTextCard.name}</span>
            
        </div>
    );
}