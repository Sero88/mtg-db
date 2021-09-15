import { apiCard } from "../types/apiCard";
import Image from 'next/image';
import { CollectionCardMenu } from "./collection-card-menu";
import {useState} from "react";


function showCardImage(imageUri:string, name:string, type:string, key: number = 1) {

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            key={key}
            data-name={name}
            data-type={type}
        />
    );
}

function showCardDetails(data:apiCard, showPrints:boolean){
    //get the collector number
    const findLetterRegex = /[a-z]+/gi;
    const regex = new RegExp(findLetterRegex);
    const regexResult = regex.exec(data.collector_number);
    const collectionPromoType = regexResult && '0' in regexResult ?  regexResult[0] : '';
    const collectorNumber = collectionPromoType ? data.collector_number.replace(collectionPromoType,'') : data.collector_number;
    const collectionType = {
        s: 'pre-release',
        p: 'promo'
    };

    const collectionText = collectionPromoType && collectionPromoType in collectionType ? collectionType[collectionPromoType] : '';
    const printDetails = 
        <div>
            <p>{collectorNumber}{ collectionText && ` (${collectionText})`}</p>
            <p>{data.set_name}</p>
        </div>
    
    return (
        <>
        <p>{data.name}</p>
        {showPrints && printDetails}
        </>  
    );
}

type CardApiProps = {
    data: apiCard,
    showPrints: boolean,
    collectionData: string[],
    updateCollectionHandler: (event:React.MouseEvent) => void,

}

export default function CardApi({data, showPrints, collectionData, updateCollectionHandler}:CardApiProps){
    const type = showPrints ? 'print' : 'general';
    
    //if the card doesn't have an image_uri 
    if( !('image_uris' in data) && 'card_faces' in data ){
        return (
            <div className="card dual-card">
                ({
                    data.card_faces.map((cardFace, index)=> {
                        if('image_uris' in cardFace){
                            return(
                                showCardImage(cardFace.image_uris.normal, data.name, type, index)
                            );
                        }
                        
                        return;
                    })
                })
                {showCardDetails(data, showPrints)}
                {showPrints && <CollectionCardMenu updateCollectionHandler={updateCollectionHandler} cardData={data}/> } 
            </div>
        )
    } else {
        return(
            <div className="card">
                {showCardImage(data.image_uris.normal, data.name, type)}
                {showCardDetails(data,showPrints)}
                {showPrints && <CollectionCardMenu updateCollectionHandler={updateCollectionHandler} cardData={data} /> } 
            </div>)
        ;
        
    }    z
}