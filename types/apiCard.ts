export type apiCard = {         
    oracle_id: string,
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