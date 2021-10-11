export type ApiCard = { 
    id: string, //unique to scryfall 
    oracle_id: string, //unique to card on MTG's Oracle, but shares across same card name. So two cards across different sets have the same oracle_id
    name: string,
    color_identity: string[],
    keywords: string[],
    legalities: {},
    type_line: string,
    rarity: string,
    layout: string
    collector_number: string,
    set: string,
    set_name: string,
    set_type: string,
    promo: boolean,
    
    //can be missing or nullable
    mana_cost?: string,
    flavor_text?: string,
    loyalty?: number,
    oracle_text?: string,
    power?: string,
    toughness?: string, 
    artist?: string,
    image_uris?: {small:string, normal:string},
    card_faces?: CardFace[],
    promo_types?: string[],
    
}

export type CardFace = {
    image_uris: {small:string, normal:string},
    mana_cost: string
}