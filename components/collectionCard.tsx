import { CollectionCardType } from "../types/collectionCard";
import Image from 'next/image';
import styles from "../styles/card.module.scss";
import { CardDetails } from "./cardDetails";
import {CollectionCard} from "../util/collectionCard";

function showCardImage(data:CollectionCardType) {
    const name = data.name;
    const imageUri = CollectionCard.getCardImage(data, 'no_promo');

    return (
        <Image
            src={imageUri}
            width={196}
            height={273}
            data-name={name}
            alt={name}
            className={styles.cardImage}
            unoptimized={true}
        />
    );
}

function showCardDetails(data:CollectionCardType){

    return(
        <CardDetails
            name={data.name}
            className={styles.cardNameLink}
            showExtra={false}
        />
    );
}

export default function CollectionCardComponent({data}:{data:CollectionCardType}){

    return(
        <div className={styles.card}>
            <div className={styles.imageCollectionWrapper}>
                {showCardImage(data)}
            </div> 
            {showCardDetails(data)}
        </div>
    );
    
}