import { apiCard } from "../types/apiCard";
import Image from 'next/image';
import { CollectionCardMenu } from "./collection-card-menu";
import { helpers } from "../util/helpers";

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
    const collectorsData = helpers.getCollectorsData(data);
    
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
    data: apiCard,
    showPrints: boolean,
    quantity: number,
    updateCollectionHandler: (event:React.MouseEvent) => void,

}

export default function CardApi({data, showPrints, quantity, updateCollectionHandler}:CardApiProps){
    const type = showPrints ? 'print' : 'general';
    
    //if the card doesn't have an image_uri 
    if( !('image_uris' in data) && 'card_faces' in data ){
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
                {showCardImage(data.image_uris.normal, data.name, type)}
                {showCardDetails(data,showPrints)}
                {showPrints && <CollectionCardMenu quantity={quantity} updateCollectionHandler={updateCollectionHandler} cardData={data} /> } 
            </div>)
        ;
        
    }
}