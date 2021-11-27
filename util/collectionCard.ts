import { ApiCard, CardFace} from "../types/apiCard";
import { CardQuantity } from "../types/cardQuantity";
import { CollectionCardFace, CollectionCardType } from "../types/collectionCard";

export const CollectionCard = {
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

    convertManaCost: function (manaCost: string){
        const numberRegex =/[0-9]/g;
        const numberLetterComboRegex = /[0-9]\/[A-Z]/g;
        const colorsRegex = /(?![X])[A-Z](\/[A-Z])*/gm; //ignore X values
        const manaNoNumberColorCombo = manaCost.replace(numberLetterComboRegex, ''); //remove any with number/letter combinations, those count as number only (alread counted above)
        const allNumbers = manaCost.match(numberRegex);
        const allColors = manaNoNumberColorCombo.match(colorsRegex);

        const addValuesReducer = (prevValue:number, currentValue:string) => prevValue + parseInt(currentValue, 10);
       
        //add the mana value from numbers and colors
        let manaValue: number|null = allNumbers ? allNumbers.reduce(addValuesReducer, 0) : null;
        manaValue = allColors && allColors.length && manaValue !== null ? allColors.length + manaValue : manaValue;

        return manaValue;
    },

    getTypes: function(apiCardData:ApiCard){
        const typeLineString = apiCardData.type_line ? apiCardData.type_line.replace(/(—\s)|(\/\s?)+/g,''): ''; //replace "-" or "/"
        const typesArray = typeLineString.split(' ');

        const types: string[] = [];
        typesArray.forEach( type => {
            if(!types.includes(type)){
                types.push(type);
            }
        });

        return types;

    },

    getCardFacesValues: function(apiCardData: ApiCard){
        const cardFaces = [];
        const cardFaceType = ('card_faces' in apiCardData) ? 'multiface' : 'normal';

        //multiface values
        if(cardFaceType == 'multiface' && 'card_faces' in apiCardData && apiCardData.card_faces){
            apiCardData.card_faces.forEach( (cardFace:CardFace, faceIndex) => {
                cardFaces.push(this.assignCardFaceValues(faceIndex, apiCardData, cardFace));
            });
        } else {
            cardFaces.push(this.assignCardFaceValues(0, apiCardData, null));
        }

        return cardFaces;
    },

    assignCardFaceValues: function( faceIndex:number, apiCardData:ApiCard, cardFace:CardFace|null|ApiCard){
        cardFace = cardFace ?? apiCardData;
      
        const faceObject = {} as CollectionCardFace;
        faceObject.manaValue =  cardFace.mana_cost ?  this.convertManaCost(cardFace.mana_cost) : null;
        faceObject.oracleText = 'oracle_text' in cardFace && cardFace.oracle_text ? cardFace.oracle_text : '';
 
        //not all multiface images have an image on each face. Kitsune Ascendad is a multiface card with only one image, the image is in the main card info not on either face
        faceObject.imageUri = 'image_uris' in cardFace && cardFace.image_uris && cardFace.image_uris.normal ? cardFace.image_uris.normal : '';
        faceObject.imageUri = 
            !faceObject.imageUri 
            && faceIndex == 0 
            && 'image_uris' in apiCardData 
            && apiCardData.image_uris
            && 'normal' in  apiCardData.image_uris
            ? apiCardData.image_uris.normal : faceObject.imageUri ;
        
        //these are optional since not all cards have these
        'power' in cardFace && cardFace.power ? faceObject.power = cardFace.power : false;
        'toughness' in cardFace && cardFace.toughness ? faceObject.toughness = cardFace.toughness : false;
        'flavor_text' in cardFace && cardFace.flavor_text ? faceObject.flavorText = cardFace.flavor_text : false;

        return faceObject;
    },

    getCardSet: function(apiSet: string){
        const officialSetCharLimit = 3; //sets have a limit of 3 chars

        const set = apiSet.length > officialSetCharLimit ? apiSet.substring(1) : apiSet;

         //remove the prefix "p" for promos, we're treating it as part of the regular ses
        // const promoPrefixRegex = /[p]+/;
        // set = 'kah';
        // console.log(set.match(promoPrefixRegex));

       // set.replace(promoPrefixRegex, '');


        return set;
    },

    buildObject: function (apiData: ApiCard, quantity:CardQuantity){
        //prepare values
        const collectorsData = this.getCollectorsData(apiData);
        const types = this.getTypes(apiData);
        const cardFaces = this.getCardFacesValues(apiData);
        const set = this.getCardSet(apiData.set);
        const regularPrice = apiData 
            && 'prices' in apiData
            && 'usd' in apiData.prices
            && apiData.prices.usd !== null
            ? parseFloat(apiData.prices.usd)
            : null;

        const foilPrice: number|null  = apiData 
            && 'prices' in apiData
            && 'usd_foil' in apiData.prices
            && apiData.prices.usd_foil !== null
            ? parseFloat(apiData.prices.usd_foil)
            : null;
    
        const cardCollectionObject:CollectionCardType =  {
            scryfallId: apiData.id,
            name: apiData.name,
            colorIdentity: apiData.color_identity && apiData.color_identity.length > 0 ? apiData.color_identity : [],
            set,
            isPromo: apiData.promo,
            rarity: apiData.rarity,
            collectionNumber: collectorsData.number,
            types,
            cardFaces,
            quantity: quantity.regular,
            quantityFoil: quantity.foil, 
            prices: {regular: regularPrice, foil: foilPrice }
        }

        //optional values
        'loyalty' in apiData ? cardCollectionObject.loyalty = apiData.loyalty : false;
        'keywords' in apiData && apiData.keywords.length > 0 ? cardCollectionObject.keywords = apiData.keywords : false;
        'promo_types' in apiData ? cardCollectionObject.promoTypes = apiData.promo_types: false;
        'artist' in apiData ? cardCollectionObject.artist = apiData.artist : false;
       
        return cardCollectionObject;
    }
}