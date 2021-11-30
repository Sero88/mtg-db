import { ApiCard } from "../types/apiCard";


export const ApiCardHelper = {
    hasFoil: (cardData:ApiCard) => {
        const foilFinishes = ['foil', 'etched'];
        let hasFoil = false;

        for(let i = 0; i < foilFinishes.length; i++){
            if(cardData.finishes.includes(foilFinishes[i])){
                hasFoil = true;
                break;
            }
        }

        return hasFoil;
    }
}