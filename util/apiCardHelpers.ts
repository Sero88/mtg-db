import { ApiCard } from "../types/apiCard";
import { helpers } from "./helpers";
import { ApiResultsList } from "../types/apiResultsList";


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

    hasData: function(results:ApiResultsList){
        const hasData = results
        && 'data'in results
        && 'length' in results.data
        && results.data.length > 0
        ? true
        : false;

        return hasData;
    }, 

    getCollectorsData: function(apiCardData: ApiCard){

        type CollectionType = {
            [key:string]: string
        }
        
        //get the collector number
        const findLetterRegex = /[a-z]+/gi;
        const regex = new RegExp(findLetterRegex);
        const regexResult = regex.exec(apiCardData.collector_number);
        
        const collectionPromoType = regexResult && '0' in regexResult ?  regexResult[0] : '';
        const collectorNumber = collectionPromoType ? apiCardData.collector_number.replace(collectionPromoType,'') : apiCardData.collector_number;
        
        const collectionType: CollectionType =  {
            s: 'pre-release',
            p: 'promo'
        };

        const collectionText = collectionPromoType && collectionPromoType in collectionType ? collectionType[collectionPromoType] : '';

        return {
            number: collectorNumber,
            type: collectionText
        }
    },

}