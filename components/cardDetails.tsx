import styles from "../styles/card.module.scss";

type CardDetailsProps = {
    className: string,
    setCode: string,
    setName: string,
    name: string
    collectorNumber: string
    promoType: string
    showAll: boolean
}

export function CardDetails({className, setCode, setName, name, collectorNumber, promoType, showAll}:CardDetailsProps){
    const generalDetails = <strong className={className} data-name={name}>{name}</strong>;
    const extraDetails = 
        <> 
            <br />
            <span className={styles.collectorsData}>{`${setCode.toUpperCase()} ${collectorNumber}`}{ promoType && ` (${promoType})`}</span> {setName && (<>| <span className={styles.setName}>{setName}</span></>) }
        </>;
        
    return (
        <div>
            <p className={styles.cardDetails}>{generalDetails}{showAll && extraDetails}</p>
        </div>
    );
}