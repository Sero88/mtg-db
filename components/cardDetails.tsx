import styles from "../styles/card.module.scss";

type CardDetailsProps = {
    className: string,
    name: string
    showExtra: boolean
    setCode?: string,
    setName?: string,
    collectorNumber?: string,
    promoType?: string
}

export function CardDetails({className, setCode, setName, name, collectorNumber, promoType, showExtra}:CardDetailsProps){
    const generalDetails = <strong className={className} data-name={name}>{name}</strong>;

    const extraDetails = 
        <> 
            <br />
            <span className={styles.collectorsData}>{`${setCode && setCode.toUpperCase()} ${collectorNumber && collectorNumber}`}{ promoType && ` (${promoType})`}</span> {setName && (<>| <span className={styles.setName}>{setName}</span></>) }
        </>;
        
    return (
        <div>
            <p className={styles.cardDetails}>{generalDetails}{showExtra && extraDetails}</p>
        </div>
    );
}