// @ts-nocheck
import { CollectionCardType } from "../types/collectionCard";
import Image from 'next/image';
import styles from "../styles/card.module.scss";
import { CardDetails } from "./cardDetails";

function showCardImage(data:CollectionCardType) {
    const name = data.name;
    const imageUri = data.cardFaces[0].imageUri;
    

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            data-name={name}
            alt={name}
            className={styles.cardImage}
        />
    );
}

function showCardDetails(data:CollectionCardType){

    const promo = data.isPromo
        && 'promoTypes' in data
        && data.promoTypes
        && data.promoTypes.length > 0 
        ? data.promoTypes[0] //first promo type is the one we use
        : ''

    
    return(
        <CardDetails
            className={styles.cardNameLink}
            setCode={data.set}
            collectorNumber={data.collectionNumber}
            promoType={promo}
            name={data.name}
            showAll={false}
            setName={''}
        />
    );
}

export default function CollectionCard({data}:{data:CollectionCardType}){

    return(
        <div className={styles.card}>
            <div className={styles.imageCollectionWrapper}>
                {showCardImage(data)}
            </div> 
            {showCardDetails(data)}
        </div>
    );
    
}