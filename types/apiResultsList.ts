import { ApiCard } from "./apiCard"
export type ApiResultsList = {
    data: ApiCard[],
    has_more: boolean,
    next_page: string,
    total_cards: number,
    warnings: string[]
}