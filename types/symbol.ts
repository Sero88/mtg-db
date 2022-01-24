export type SymbolType = {
    symbol: string,
    english: string,
    svg_uri: string, 
    represents_mana: boolean
    colors: string[]
    loose_variant?: boolean
    cmc: number
}