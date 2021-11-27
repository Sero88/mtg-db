export type CollectionCardType = { 
    scryfallId: string
    name: string
    colorIdentity: string[],
    set: string,
    isPromo: boolean,
    quantity: number,
    quantityFoil: number,
    rarity: string
    collectionNumber: string,
    types: string[],
    cardFaces: CollectionCardFace [],

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
