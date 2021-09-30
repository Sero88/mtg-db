import { apiCard } from '../types/apiCard';
import {Icon} from './font-awesome-icon'; 


type CollectionCardMenuProp  = {
    cardData: apiCard,
    quantity: number,
    updateCollectionHandler: (event:React.MouseEvent) => void,
}
export function CollectionCardMenu({quantity, updateCollectionHandler, cardData}:CollectionCardMenuProp){
    const updateHandler = (e) => {
        updateCollectionHandler(e, cardData, quantity);
    }

    return (
        <ul className="cardCollectionMenu">
            <li onClick={updateHandler} data-collection_menu_action="add"><Icon icon="plus"/></li>
            <li onClick={updateHandler} data-collection_menu_action="remove"><Icon icon="minus"/></li>
            <li>{quantity ?? 0}</li>
        </ul>
    );
}