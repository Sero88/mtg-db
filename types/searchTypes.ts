import { StatConditionalEnums } from "../util/enums/searchConditionals";

export type SelectorListType = {
    queryKey: string //same as object key, used to match the update
    items: SelectorListTypeItem[], 
    conditionals: {
        allowPartials?: boolean
    }
}

export type SelectorListTypeItem = {
    name:string, 
    is:boolean, 
    value: string
    uri?: string
}

export type ColorsSelectorType = {
    selected: string[],
    conditional: number
}
 

export type DisplayListItem = {
    name: string,
    uri?: string, 
    value: string, 
}

export type CardStatsType = {
    [key:string]: {
        type: string, 
        conditional:StatConditionalEnums, 
        value?: string
    }
}

export type SearchObject = {
    cardName?: string,
    cardText?: string,
    cardTypes?: SelectorListType,
    cardColors?: ColorsSelectorType,
    cardStats?: CardStatsType,
    cardSets?: SelectorListType,
}
