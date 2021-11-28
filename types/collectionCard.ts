export type CollectionCardType = { 
    scryfallId: string
    name: string
    colorIdentity: string[],
    set: string,
    isPromo: boolean,
    quantity: {regular: number, foil: number}
    rarity: string
    collectionNumber: string,
    types: string[],
    cardFaces: CollectionCardFace [],
    prices: {regular:number|null, foil:number|null}

    //optional,
    loyalty?: number,
    keywords?: string[], 
    promoTypes?: string[],
    artist?: string
}

export type CollectionCardFace = {
    manaValue: number | null,
    oracleText: string,
    imageUri: string,
    power?: string,
    toughness?: string, 
    flavorText?: string
}
