import { cardModalStateType } from "../types/cardModal";
import { CollectionCard } from "../util/collectionCard";
import styles from "../styles/card.module.scss";
import Image from 'next/image';
import { CollectionCardType, Version } from "../types/collectionCard";
import { ApiSet } from "../types/apiSet";
import { helpers } from "../util/helpers";

function showIconImage(uri:string){
    return (
        <Image
            src={uri}
            width={15}
            height={15}
            unoptimized={true}
        />
    );
}

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

function getVersionRows(versions: Version[],apiSets: ApiSet[]){
    return versions.map((version,index) => {
        const regularPrice = version.prices.regular ? "$" + version.prices.regular : '-';
        const foilPrice = version.prices.foil ? "$" + version.prices.foil : '-';
        const setImage = helpers.getImageFromSet(apiSets,version.set);
        const promo = version.isPromo ?  <span> promo</span> : '';
        return(
            <tr key={index} data-id={version.scryfallId}>
                <td>{setImage && showIconImage(setImage)}{`${version.set.toUpperCase()} ${version.collectionNumber}`}{promo}</td>
                <td>{regularPrice} <b>/</b> {foilPrice}</td>
                <td>{version.quantity.regular ?? 0}</td>
                <td>{version.quantity.foil ?? 0}</td>
                
            </tr>
        );
    });
}

export function CollectionCardModal({cardModalState, apiSets}:{cardModalState:cardModalStateType, apiSets:ApiSet[]}){
    const card = cardModalState.selectedCard;
    const versions = 'versions' in card && card.versions ? card.versions : [];
    const images = getImages(card, versions);
    const versionRows = getVersionRows(versions, apiSets);
    
    return(
        <div className="cardModalContainer">
            <h1>{card.name}</h1>
            {images}
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Version</th>
                            <th>Price</th>
                            <th>Regular</th>
                            <th>Foil</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {versionRows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}