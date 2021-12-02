import { ApiCard } from "../types/apiCard";
import Image from 'next/image';
import { CollectionCardMenu } from "./collection-card-menu";
import { CollectionCard } from "../util/collectionCard";
import styles from "../styles/card.module.scss";
import { CardQuantity } from "../types/cardQuantity";

function showCardImage(imageUri:string, name:string, type:string, key: number = 1) {
    const imageClass = type=='print' ? " " + styles.imagePrint : '';

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            key={key}
            data-name={name}
            data-type={type}
            alt={name}
            className={styles.cardImage+imageClass}
        />
    );
}

function showCardDetails(data:ApiCard, showPrints:boolean){
    const collectorsData = CollectionCard.getCollectorsData(data);
    const setCode = CollectionCard.getCardSet(data.set);
    const nameClass = !showPrints ? styles.cardNameLink : styles.cardName;
    const generalDetails =  <strong className={nameClass} data-name={data.name}>{data.name}</strong> ;
    const printDetails = <> <br /> <span className={styles.collectorsData}>{`${setCode.toUpperCase()} ${collectorsData.number}`}{ collectorsData.type && ` (${collectorsData.type})`}</span> | <span className={styles.setName}>{data.set_name}</span> </>;
        
    return (
        <div>
            <p className={styles.cardDetails}>{generalDetails}{showPrints && printDetails} </p>
        </div>
    );
}

type CardApiProps = {
    data: ApiCard,
    showPrints: boolean,
    quantity: {regular:number, foil: number},
    updateCollectionHandler: (event:React.MouseEvent|React.ChangeEvent<HTMLInputElement>, card:ApiCard, quantity:CardQuantity, type: string) => void,

}

export default function CardApi({data, showPrints, quantity, updateCollectionHandler}:CardApiProps){
    const type = showPrints ? 'print' : 'general';
    const cardImageUrl = 'image_uris' in data && data.image_uris && 'normal' in data.image_uris ? data.image_uris.normal : '';
    
    //if the card doesn't have an image_uri - check card faces
    if( !cardImageUrl && 'card_faces' in data && data.card_faces ){
        return (
            <div className={`${styles.card} ${styles.dualCard}`}>
                <div className={styles.imageCollectionWrapper}>
                    <div className={`${styles.imagesWrapper}`}>
                        {
                            data.card_faces.map((cardFace, index)=> {
                                if('image_uris' in cardFace ){
                                    //only show the main face of the card - return after the first face image
                                    if(!showPrints && index > 0){
                                        return;
                                    }
                                    return(
                                       showCardImage(cardFace.image_uris.normal, data.name, type, index)   
                                    );
                                }
                                
                                return;
                            })
                        }
                    </div>
                     {showPrints && <CollectionCardMenu quantity={quantity} updateCollectionHandler={updateCollectionHandler} cardData={data}  /> }
                </div>
                {showCardDetails(data, showPrints)}
            </div>
        )
    } else {
        return(
            <div className={styles.card}>
                <div className={styles.imageCollectionWrapper}>
                    {showCardImage(cardImageUrl, data.name, type)}
                    {showPrints && <CollectionCardMenu quantity={quantity} updateCollectionHandler={updateCollectionHandler} cardData={data}  /> }
                </div> 
                {showCardDetails(data,showPrints)}

            </div>)
        ;
        
    }
}