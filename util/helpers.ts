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
    },

    getCardSet: function(apiSet: string){

        const set = apiSet.length > helpers.getOfficialCardLimit() ? apiSet.substring(1) : apiSet;

         //remove the prefix "p" for promos, we're treating it as part of the regular ses
        // const promoPrefixRegex = /[p]+/;
        // set = 'kah';
        // console.log(set.match(promoPrefixRegex));

       // set.replace(promoPrefixRegex, '');


        return set;
    },

    parentHasSymbol: function(clickedElement: HTMLElement){
        return clickedElement.parentElement
            && 'dataset' in clickedElement.parentElement
            && 'symbol' in clickedElement.parentElement.dataset
            && clickedElement.parentElement.dataset.symbol
            ? true
            : false;
    },

    getUniqueWords: function(text:string):{words:string[], text:string}{
        //remove any extra space and split by space
        text = text.trim();
        const words = text.split(' ');

        //search for unique words
        const uniqueWords:string[] = [];
        words.forEach( word =>{
            if(uniqueWords.includes(word)){
                return;
            }
            uniqueWords.push(word);
        });

        const uniqueText = uniqueWords.join(' ');

        return {words: uniqueWords, text: uniqueText};
    },

    getTextMatchesFromList(searchText:string, list:string[]){
        const matches:string[] = [];
    
        list.forEach( item => {
            if(matches.includes(item)){
                return;
            }
            const regex = new RegExp(`${searchText}`,'i');
            const matchResults =  regex.exec(item);

            if(matchResults){
                matches.push(matchResults.input);
            }

        })

        return matches;

    }
}