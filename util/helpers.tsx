import { CardQuantity } from "../types/cardQuantity";
import { DisplayListItem } from "../types/searchTypes";
import Image from 'next/image';
import { ApiSet } from "../types/apiSet";
import { Version } from "../types/collectionCard";

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
        //remove any stop words
        const stopWords = ['in', 'on', 'a', 'the', 'of', 'at'];
        stopWords.forEach( stopWord => {
            const regex = new RegExp(`${stopWord}\\s`,'gi');
            text = text.replace(regex,'');
        })

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

    getTextMatchesFromList(searchText:string, list:DisplayListItem[]){
        const matchedString:string[] = [];
        const matchedItems:DisplayListItem[] = [];
    
    
        list.forEach( (item:DisplayListItem, index:number) => {
            if(matchedString.includes(item.name)){
                return;
            }
            const regex = new RegExp(`${searchText}`,'i');
            const matchResults =  regex.exec(item.name);

            if(matchResults){
                matchedString.push(matchResults.input);
                matchedItems.push(list[index]);
            }

        })

        return matchedItems;

    },

    getDisplayItemImage(item:DisplayListItem, size = 15){
        return(
            <Image
                src={item.uri ?? ''}
                alt={item.name}
                height={size}
                width={size}
                unoptimized={true}
            />
        );
    }, 

    getImageFromSet(apiSets:ApiSet[], set:string){
        for(let apiSet of apiSets){
            if(apiSet.code == set){
                return apiSet.icon_svg_uri;
            }
        }
    },

    getVersion(versions: Version[], scryfallId:string){
        let selectedVersion = {} as Version;
        for(let version of versions){
            if(version.scryfallId == scryfallId){
                selectedVersion = version;
            }
        }

        return selectedVersion;
    },

    getDataset(element:HTMLElement, name:string ){
        const value = 'dataset' in element
            && element.dataset
            && name in element.dataset
            && element.dataset[name]
            ? element.dataset[name]
            : null;
        
        return value;
    }
}