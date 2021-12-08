import { CardQuantity } from "../types/cardQuantity";

export const helpers = {
    officialSetCharLimit: 3, // official sets have 3 chars
    collectionLimit: 4, //limit of each card in collection

    collectionApiResponse: function(status:string, message:string, data = {}){
        return {
            status,
            message, 
            data
        }
    },

    convertNameToId(name:string):string{
        const convertedName = name.replace(" ", "-");
        return convertedName;
    },

    getOfficialCardLimit: function(){
        return this.officialSetCharLimit;
    },

    //verify quantity does not exceed limit
    isValidQuantity: function($quantity:CardQuantity){
        const regularIsValid = $quantity.regular > this.collectionLimit ? false : true;
        const foilIsValid = $quantity.foil > this.collectionLimit ? false : true;

        return regularIsValid && foilIsValid;
    }
}