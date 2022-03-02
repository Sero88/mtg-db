import { cardModalStateType } from "../types/cardModal";
import styles from "../styles/collectionCardModal.module.scss";
import Image from 'next/image';
import { CollectionCardType, Version } from "../types/collectionCard";
import { ApiSet } from "../types/apiSet";
import { helpers } from "../util/helpers";
import { Icon } from "../components/font-awesome-icon";

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

function getImages(card:CollectionCardType, version:Version){
    //for each card face get the correspondant image
    const images = card.cardFaces.map((cardFace, index)=> {
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

    });
    return images;
}

function getVersionRows(versions: Version[],apiSets: ApiSet[], selectedVersion:Version, versionClickHandler:  (event:React.MouseEvent) => void){
    return versions.map((version,index) => {
        const regularPrice = version.prices.regular ? "$" + version.prices.regular : 'N/A';
        const foilPrice = version.prices.foil ? "$" + version.prices.foil : 'N/A';
        const setImage = helpers.getImageFromSet(apiSets,version.set);
        const promo = version.isPromo ?  <span> promo</span> : '';
        const selectedRowClass = selectedVersion.scryfallId == version.scryfallId ? styles.selectedVersion : styles.versionRow;
        return(
            <tr key={index} data-id={version.scryfallId} className={selectedRowClass} onClick={versionClickHandler}>
                <td className={styles.versionCell}>{setImage && showIconImage(setImage)}{`${version.set.toUpperCase()} ${version.collectionNumber}`}{promo}</td>
                <td>{version.quantity.regular ?? 0}</td>
                <td>{version.quantity.foil ?? 0}</td>
                <td>{regularPrice} <b>|</b> {foilPrice}</td>
            </tr>
        );
    });
}

type CollectionCardModalProps = {
    cardModalState:cardModalStateType, 
    apiSets:ApiSet[], 
    versionClickHandler:  (event:React.MouseEvent) => void,
    modalCloseClickHandler:  (event:React.MouseEvent) => void,
}

export function CollectionCardModal({cardModalState, apiSets, versionClickHandler, modalCloseClickHandler}:CollectionCardModalProps){
    const card = cardModalState.selectedCard;
    const versions = 'versions' in card && card.versions ? card.versions : [];
    const selectedVersion = cardModalState.selectedVersion;

    const images = getImages(card, selectedVersion);
    const versionRows = getVersionRows(versions, apiSets, selectedVersion, versionClickHandler);
    
    return(
        <div className={styles.cardModalContainer}  onClick={modalCloseClickHandler} data-close={true}>
            <div className={styles.cardModalWrapper}>
                <header>
                    <h1>{card.name}</h1>
                    <div className={styles.closeModal} onClick={modalCloseClickHandler} data-close={true}><Icon icon="times" /></div>
                </header>
    
                <div className={styles.cardModalMain}>
                    <div className={styles.cardImages}>
                        {images}
                    </div>
                    
                    <table className={styles.versionsTable} >
                        <thead>
                            <tr>
                                <th className={styles.versionHeader}>Version</th>
                                <th>Regular</th>
                                <th>Foil</th>
                                <th>Prices (R|F)</th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            {versionRows}
                        </tbody>
                    </table>
                </div>
              
            </div>
        </div>
    )
}