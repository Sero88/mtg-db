/* 
fields that are required in the collection are marked as null when empty
optional fields are either present or not, no null values
(this does not match Scryfall's fields that are null or not, this only pertains to the collection. Scryfall varies on what they mark as null or return empty, inconsistent)

What I learned, usually with SQL, you see the table to learn the structure. With MongoDB, you can't rely on the documents
to learn the structure, because some fields are optional. This types file is my structure for the DB, because it contains all optional and required fields.
*/

export type CollectionCardType =  {
    name: string;
    oracleId: string;
    colorIdentity: string[] | null; //cards always have a color identity, colorless = null (empty array on scryfall)
    types: string[];
    cardFaces: CollectionCardFace[]; 

    versions?: Version[]; //CollectionCardType will be usually queried with versions
    keywords?: string[]; //not all cards can have keywords it is an optional field
}

interface VersionInterface {
    scryfallId: string;
    oracleId: string;
    isPromo: boolean;
    collectionNumber: string;
    rarity: string;
    prices: {regular:number|null, foil:number|null};
    set: string;
    images: ImageObject[], //images object is required, but Scryfall marks artist and uri as nullable, so it will account for that

    promoTypes?: string[]; //promo types is optional since a card may not be a promo
}


type ImageObject = {
    artist: string | null 
    imageUri: string | null
}

export interface Version extends VersionInterface {
    quantity: {regular?: number, foil?: number} //optional since we may or may not have of either type
}

export interface VersionQuery extends VersionInterface {
    'quantity.regular'?: number,
    'quantity.foil'?: number
}


export type CollectionCardFace = {
    manaValue: number | null, // not on scryfall, my own field:  mana value(aka cmc) field
    manaCost: string | null, // not to be confused with manaValue. ManaValue is the converted mana cost (mana value), while manaCost is the representation of how it can be casted: {2}{G}
    
    //optional values - depending on the type of card, these may or may not apply, thus optional
    oracleText?: string
    power?: string,
    toughness?: string, 
    loyalty?: number,
    flavorText?: string
}

