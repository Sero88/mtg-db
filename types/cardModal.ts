import { CollectionCardType, Version } from "./collectionCard";

export type cardModalStateType = {
    selectedCard: CollectionCardType,
    showModal: boolean,
    selectedVersion: Version,
}