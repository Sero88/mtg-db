import { CollectionCardType } from "../types/collectionCard";
import Image from 'next/image';
import styles from "../styles/card.module.scss";

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