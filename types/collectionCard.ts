interface CollectionCard {
    scryfallId: string;
    name: string;
    colorIdentity: string[];
    set: string;
    isPromo: boolean;
    
    rarity: string;
    collectionNumber: string;
    types: string[];
    cardFaces: CollectionCardFace[];
    prices: {regular:number|null, foil:number|null}

    //optional
    loyalty?: number;
    keywords?: string[]; 
    promoTypes?: string[];
    artist?: string;
}

export interface CollectionCardType extends CollectionCard{ 
    quantity: {regular?: number, foil?: number}
}

export interface CollectionCardTypeQuery extends CollectionCard{
    'quantity.regular'?: number,
    'quantity.foil'?: number
}

export type CollectionCardFace = {
    manaValue: number | null,
    oracleText: string,
    imageUri: string,
    power?: string,
    toughness?: string, 
    flavorText?: string
}
