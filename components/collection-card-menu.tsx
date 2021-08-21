import {Icon} from './font-awesome-icon';

type CollectionCardMenuProp  = {
    quantity: number,
}
export function CollectionCardMenu(){
    return (
        <div className="cardCollectionMenu">
            <Icon icon="plus" />
            <Icon icon="minus"/>
            <span>2</span>
        </div>
    );
}