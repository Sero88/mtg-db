export type SelectorListType = {
    queryKey: string //same as object key, used to match the update
    items: SelectorListTypeItem[], 
    conditionals: {
        allowPartials?: boolean
    }
}

export type SelectorListTypeItem = {
    name:string, 
    is:boolean
}

export type SearchObject = {
    cardName?: string,
    cardText?: string,
    cardTypes?: SelectorListType,
}
