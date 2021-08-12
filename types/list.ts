import { apiCard } from "./apiCard"
export type list = {
    data: apiCard[],
    has_more: boolean,
    next_page: string,
    total_cards: number,
    warnings: string[]
}