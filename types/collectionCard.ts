interface CollectionCard {
    name: string;
    oracleId: string;
    colorIdentity: string[]; 
    types: string[];
    cardFaces: CollectionCardFace[];
    
    keywords?: string[]; 
}

interface VersionInterface {
    scryfallId: string;
    isPromo: boolean;
    collectionNumber: string;
    rarity: string;
    prices: {regular:number|null, foil:number|null};
    set: string;
    images: ImageObject[],

    promoTypes?: string[];
}

type ImageObject = {
    artist: string, 
    uri: string
}

export interface Version extends VersionInterface {
    quantity: {regular?: number, foil?: number}
}

export interface VersionQuery extends VersionInterface {
    'quantity.regular'?: number,
    'quantity.foil'?: number
}

export interface CollectionCardType extends CollectionCard{ 
    versions: {[key:string]:Version},
}

export interface CollectionCardTypeQuery extends CollectionCard{
    [key:string]: any, // The version keys vary
}

export type CollectionCardFace = {
    manaValue: number | null, // not on scryfall, my own field:  mana value(aka cmc) field
    manaCost: string|null, // not to be confused with manaValue. ManaValue is the converted mana cost (mana value), while manaCost is the representation of how it can be casted: {2}{G}
    oracleText: string,
    
    
    //optional values
    power?: string,
    toughness?: string, 
    loyalty?: number,
    flavorText?: string
}

