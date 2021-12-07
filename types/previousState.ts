import { ApiResultsList } from "./apiResultsList";

export type PreviousStateType = {
    query: string, 
    results: ApiResultsList,
    searchText: string,
    cardId: string,
    page: number
}