import { ApiCard } from '../types/apiCard';
import {Icon} from './font-awesome-icon'; 
import styles from '../styles/collectionMenu.module.scss';


type CollectionCardMenuProp  = {
    cardData: ApiCard,
    quantity: number,
    updateCollectionHandler: (event:React.MouseEvent, card: ApiCard, quantity:number) => void,

}
export function CollectionCardMenu({quantity, updateCollectionHandler, cardData}:CollectionCardMenuProp){
    const updateHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
        updateCollectionHandler(e, cardData, quantity);
    }

    return (
        <ul className={styles.collectionMenu}>
            <li onClick={updateHandler} data-collection_menu_action="add" className={styles.addMenu}><Icon icon="plus"/></li>
            <li onClick={updateHandler} data-collection_menu_action="remove" className={styles.removeMenu}><Icon icon="minus"/></li>
            <li className={styles.collectionQuantity}>{quantity ?? 0}</li>
        </ul>
    );
}