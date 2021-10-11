import { ApiCard } from "./apiCard"
export type list = {
    data: ApiCard[],
    has_more: boolean,
    next_page: string,
    total_cards: number,
    warnings: string[]
}