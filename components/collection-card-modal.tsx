import { cardModalStateType } from "../types/cardModal";
import { CollectionCard } from "../util/collectionCard";
import styles from "../styles/card.module.scss";
import Image from 'next/image';
import { CollectionCardType, Version } from "../types/collectionCard";


function showCardImage(imageUri:string, name:string,  key: number = 1) {

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            key={key}
            data-name={name}
            alt={name}
            unoptimized={true}
        />
    );
}

function getImages(card:CollectionCardType, versions:Version[]){
    const initialImage = CollectionCard.getCardImage(card);
    let images = [] as JSX.Element[];

    //cycle through versions to match the one shown in results
    for(const version of versions){
        if(version.scryfallId == initialImage.scryfallId){
            //for each card face get the correspondant image
            images = card.cardFaces.map((cardFace, index)=> {
                let imageUri = 'imageUri' in  version.images[index]
                    && version.images[index].imageUri 
                    ? version.images[index].imageUri 
                    : '';
               
                let imageJSX = <></>

                //verify there is an image uri, if there is none for the main face, show not available. (Multiple face cards can have null values on non-main faces, this is okay)
                if(imageUri){
                    imageJSX = showCardImage(imageUri, card.name, index);
                } else if( index >= 1 ){
                    imageJSX = <></>;
                } else {
                    imageJSX = showCardImage('/images/notavailable.png', card.name, index);
                }
                
                return imageJSX;
        })
        
        break;

        }
    }

    return images;
}

export function CollectionCardModal({cardModalState}:{cardModalState:cardModalStateType}){
    const card = cardModalState.selectedCard;
    const versions = 'versions' in card && card.versions ? card.versions : [];
    const images = getImages(card, versions);
    //todo remove after testing 👇
    console.log('images', images );
    //todo remove after testing 👆
    

    return(
        <div className="cardModalContainer">
            <h1>{card.name}</h1>
            {images}
        </div>
    )
}