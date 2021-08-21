import { apiCard } from "../types/apiCard";
import Image from 'next/image';
import { CollectionCardMenu } from "./collection-card-menu";

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

function showCardDetails(data:apiCard){
    return (
        <p>{data.name}</p>
    );
}

type CardApiProps = {
    data: apiCard,
    showPrints: boolean
}

export default function CardApi({data, showPrints}:CardApiProps){
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
                {showCardDetails(data)}
                {showPrints && <CollectionCardMenu /> } 
            </div>
        )
    } else {
        return(
            <div className="card">
                {showCardImage(data.image_uris.normal, data.name, type)}
                {showCardDetails(data)}
                {showPrints && <CollectionCardMenu /> } 
            </div>)
        ;
        
    }    
}