import {CollectionCardType} from './collectionCard';

export type ApiResponse = {
    status: string, 
    data: CollectionCardType | string[]
}