import { ApiSet } from "./apiSet";
import { CollectionCardType } from "./collectionCard";

export type ResultsState = {
    results:CollectionCardType[],
    canShowResults: boolean
    sets: ApiSet[]
}