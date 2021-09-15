export type apiCard = { 
    id: string, //unique to scryfall 
    oracle_id: string, //unique to card on MTG's Oracle, but shares across same card name. So two cards across different sets have the same oracle_id
    name: string,
    mana_cost: string,
    color_identity: string[],    
    oracle_text: string[],
    keywords: string[],
    legalities: {},
    loyalty: number|null,    
    power: string,
    toughness: string,
    type_line: string,
    artist: string,
    flavor_text: string|null,
    image_uris: {small:string, normal:string},
    rarity: string,
    card_faces: CardFace[],
    layout: string
    collector_number: string,
    set: string,
    set_name: string,
    set_type: string,
}

type CardFace = {
    image_uris: {small:string, normal:string}
}


/*
todo remove - my fields for the db
sets: string[] (use unique print or prints_search_uri), 
quantity: number,
card_type: "normal|dual" (my own field based on scryfall face count)
*/