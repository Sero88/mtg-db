export type SelectorListType = {
    queryKey: string //same as object key, used to match the update
    items: {name:string, is:boolean}[], 
    allowPartials: boolean
}

export type SearchObject = {
    cardName?: string,
    cardText?: string,
    cardTypes?: SelectorListType[]
}
