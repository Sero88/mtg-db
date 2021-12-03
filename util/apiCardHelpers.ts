import { ApiCard } from "../types/apiCard";
import { helpers } from "./helpers";


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
    },

     // added this check since scryfall had pvow marked as expansion
    isRegularSet: function (apiSet: string ): boolean{
        return apiSet.length > helpers.getOfficialCardLimit() ?  false : true;
    },
}