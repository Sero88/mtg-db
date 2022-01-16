export type SearchCardType = {
    name: string,
    is: boolean
}

export type SearchObject = {
    cardName?: string,
    cardText?: string,
    cardTypes?: SearchCardType[]
}
