import { ApiCard } from '../types/apiCard';
import Image from 'next/image';
import styles from '../styles/collectionMenu.module.scss';
import { CardQuantity } from '../types/cardQuantity';
import { ApiCardHelper } from '../util/apiCardHelpers';


type CollectionCardMenuProp  = {
    cardData: ApiCard,
    quantity: CardQuantity,
    updateCollectionHandler: (event:React.MouseEvent|React.ChangeEvent<HTMLInputElement>, card: ApiCard, quantity:CardQuantity, type:string) => void,

}
export function CollectionCardMenu({quantity, updateCollectionHandler, cardData}:CollectionCardMenuProp){

    const regularQty = quantity && 'regular' in quantity ? quantity.regular: 0;
    const foilQty = quantity && 'foil' in quantity ? quantity.foil: 0;

    function selectText(e:React.MouseEvent<Element, MouseEvent>){
        const element = e.target as HTMLInputElement;
        element.select();
    }
     
    function updateQuantity(e: React.ChangeEvent<HTMLInputElement>){
        const newQuantity = e.target.value == '' ? 0 : parseInt(e.target.value);
       
        e.target.name == 'collection-quantity' 
            ? updateCollectionHandler(e, cardData, {regular: newQuantity, foil: foilQty}, 'regular') 
            : updateCollectionHandler(e, cardData, {regular: regularQty, foil: newQuantity}, 'foil');
    }

    return (
        <ul className={styles.collectionMenu}>
            {/*<li onClick={updateHandler} data-collection_menu_action="add" className={styles.addMenu}><Icon icon="plus"/></li>
            <li onClick={updateHandler} data-collection_menu_action="remove" className={styles.removeMenu}><Icon icon="minus"/></li> */}
            <li className={styles.collectionLogo}>
                <Image
                    src="/images/favicon.png"
                    width={25}
                    height={25}
                    alt="collection logo"
                    unoptimized={true}
                />
            </li>

            { cardData.finishes.includes('nonfoil') &&
                <li className={styles.collectionQuantity}>
                    <input name="collection-quantity" type="number" value={regularQty ?? 0} onClick={(e)=>{selectText(e)}} onChange={updateQuantity} data-collection_menu_action="set" />
                </li> 
            }

            { ApiCardHelper.hasFoil(cardData) &&
                <li className={styles.collectionQuantityFoil}>
                    <input name="collection-foil-quantity" type="number" value={foilQty?? 0} onClick={(e)=>{selectText(e)}} onChange={updateQuantity} data-collection_menu_action="set" />
                </li>
            }

        </ul>
    );
}