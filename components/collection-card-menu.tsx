import { ApiCard } from '../types/apiCard';
import {Icon} from './font-awesome-icon'; 
import styles from '../styles/collectionMenu.module.scss';



type CollectionCardMenuProp  = {
    cardData: ApiCard,
    quantity: number,
    updateCollectionHandler: (event:React.MouseEvent|React.ChangeEvent<HTMLInputElement>, card: ApiCard, quantity:number) => void,

}
export function CollectionCardMenu({quantity, updateCollectionHandler, cardData}:CollectionCardMenuProp){

    function selectText(e:React.MouseEvent<Element, MouseEvent>){
        const element = e.target as HTMLInputElement;
        element.select();
    }
    const updateHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
        
        updateCollectionHandler(e, cardData, quantity);
    }
     
    function updateQuantity(e: React.ChangeEvent<HTMLInputElement>){
        const newQuantity = parseInt(e.target.value);
        updateCollectionHandler(e, cardData, newQuantity);
    }

    return (
        <ul className={styles.collectionMenu}>
            <li onClick={updateHandler} data-collection_menu_action="add" className={styles.addMenu}><Icon icon="plus"/></li>
            <li onClick={updateHandler} data-collection_menu_action="remove" className={styles.removeMenu}><Icon icon="minus"/></li>
            <li className={styles.collectionQuantity}><input name="collection-quantity" type="number" value={quantity ?? 0}  min="0" onClick={(e)=>{selectText(e)}} onChange={updateQuantity} data-collection_menu_action="set" /></li>
        </ul>
    );
}