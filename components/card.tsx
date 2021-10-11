import { ApiCard } from "../types/apiCard";
import Image from 'next/image';
import { CollectionCardMenu } from "./collection-card-menu";
import { CollectionCard } from "../util/collectionCard";

function showCardImage(imageUri:string, name:string, type:string, key: number = 1) {

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            key={key}
            data-name={name}
            data-type={type}
            alt={name}
        />
    );
}

function showCardDetails(data:ApiCard, showPrints:boolean){
    const collectorsData = CollectionCard.getCollectorsData(data);
    
    const printDetails = 
        <div>
            <p>{collectorsData.number}{ collectorsData.type && ` (${collectorsData.type})`}</p>
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
    data: ApiCard,
    showPrints: boolean,
    quantity: number,
    updateCollectionHandler: (event:React.MouseEvent, card:ApiCard, quantity:number) => void,

}

export default function CardApi({data, showPrints, quantity, updateCollectionHandler}:CardApiProps){
    const type = showPrints ? 'print' : 'general';
    const cardImageUrl = 'image_uris' in data && data.image_uris && 'normal' in data.image_uris ? data.image_uris.normal : '';
    
    //if the card doesn't have an image_uri - check card faces
    if( !cardImageUrl && 'card_faces' in data && data.card_faces ){
        return (
            <div className="card dual-card">
                {
                    data.card_faces.map((cardFace, index)=> {
                        if('image_uris' in cardFace){
                            return(
                                showCardImage(cardFace.image_uris.normal, data.name, type, index)
                            );
                        }
                        
                        return;
                    })
                }
                {showCardDetails(data, showPrints)}
                {showPrints && <CollectionCardMenu quantity={quantity} updateCollectionHandler={updateCollectionHandler} cardData={data}/> } 
            </div>
        )
    } else {
        return(
            <div className="card">
                {showCardImage(cardImageUrl, data.name, type)}
                {showCardDetails(data,showPrints)}
                {showPrints && <CollectionCardMenu quantity={quantity} updateCollectionHandler={updateCollectionHandler} cardData={data} /> } 
            </div>)
        ;
        
    }
}