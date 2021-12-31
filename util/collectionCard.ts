import { ApiCard, CardFace} from "../types/apiCard";
import { helpers } from "./helpers";
import { CollectionCardFace, CollectionCardTypeQuery, VersionQuery } from "../types/collectionCard";
import { ApiCardHelper } from "./apiCardHelpers";
import { CardQuantity } from "../types/cardQuantity";

export const CollectionCard = {

    

    convertManaCost: function (manaCost: string){
        const numberRegex =/[0-9]/g;
        const numberLetterComboRegex = /[0-9]\/[A-Z]/g;
        const colorsRegex = /(?![X])[A-Z](\/[A-Z])*/gm; //ignore X values - they can be 0
        const manaNoNumberColorCombo = manaCost.replace(numberLetterComboRegex, ''); //remove any with number/letter combinations, those count as number only (alread counted above)
        const allNumbers = manaCost.match(numberRegex);
        const allColors = manaNoNumberColorCombo.match(colorsRegex);

        const addValuesReducer = (prevValue:number, currentValue:string) => prevValue + parseInt(currentValue, 10);
       
        //add the mana value from numbers and colors
        const manaValueNumbers: number|null = allNumbers ? allNumbers.reduce(addValuesReducer, 0) : null;
        const manaValueColors = allColors && allColors.length ? allColors.length : null;

        let manaValue = null;
        if(manaValueNumbers !== null && manaValueColors !== null ){
            manaValue = manaValueNumbers + manaValueColors;
        } else if(manaValueNumbers !== null && manaValueColors == null){
            manaValue = manaValueNumbers;
        } else if(manaValueColors !== null && manaValueNumbers == null){
            manaValue = manaValueColors;
        }

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

    isMultiface: function(apiCardData: ApiCard):boolean{
        const cardFaceType = ('card_faces' in apiCardData) ? 'multiface' : 'normal';

        return cardFaceType == 'multiface' 
            && 'card_faces' in apiCardData 
            && apiCardData.card_faces 
            ? true
            : false;
    },

    getCardFacesValues: function(apiCardData: ApiCard){
        const cardFaces = [];
        //multiface values
        if(this.isMultiface(apiCardData)){
            // @ts-ignore
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
        faceObject.manaCost = 'mana_cost' in cardFace && cardFace.mana_cost ? cardFace.mana_cost : null;
        faceObject.oracleText = 'oracle_text' in cardFace && cardFace.oracle_text ? cardFace.oracle_text : '';
        
 
        //these are optional since not all cards have these
        'loyalty' in cardFace ? faceObject.loyalty = cardFace.loyalty : false;
        'power' in cardFace && cardFace.power ? faceObject.power = cardFace.power : false;
        'toughness' in cardFace && cardFace.toughness ? faceObject.toughness = cardFace.toughness : false;
        'flavor_text' in cardFace && cardFace.flavor_text ? faceObject.flavorText = cardFace.flavor_text : false;

        return faceObject;
    },

    assignImageValues: function( faceIndex:number, apiCardData:ApiCard, cardFace:CardFace|null|ApiCard){
        cardFace = cardFace ?? apiCardData;
      
        //not all multiface images have an image on each face. Kitsune Ascendad is a multiface card with only one image, the image is in the main card info not on either face
        let imageUri = 'image_uris' in cardFace && cardFace.image_uris && cardFace.image_uris.normal ? cardFace.image_uris.normal : '';
        let artist = 'artist' in cardFace && cardFace.artist ? cardFace.artist: '';
        
        imageUri = 
            imageUri 
            && faceIndex == 0 
            && 'image_uris' in apiCardData 
            && apiCardData.image_uris
            && 'normal' in  apiCardData.image_uris
            ? apiCardData.image_uris.normal : imageUri ;

        artist = 
            artist
            && faceIndex == 0 
            && 'artist' in apiCardData 
            && apiCardData.artist
            ? apiCardData.artist : artist ;
 
        return {artist, imageUri};
    },

    getCardImages: function(apiCardData: ApiCard){
        const images = [];
       
        //multiface values
        if(this.isMultiface(apiCardData)){ 
            // @ts-ignore
            apiCardData.card_faces.forEach( (cardFace:CardFace, faceIndex) => { //@ts-ignore
                images.push(this.assignImageValues(faceIndex, apiCardData, cardFace));
            });
        } else {
            images.push(this.assignImageValues(0, apiCardData, null));
        }

        return images;
    },


    buildQueryObject: function (apiData: ApiCard, quantity:CardQuantity, type: string){
        //prepare values
        const collectorsData = ApiCardHelper.getCollectorsData(apiData);
        const types = this.getTypes(apiData);
        const cardFaces = this.getCardFacesValues(apiData);
        const images = this.getCardImages(apiData);
        const set = helpers.getCardSet(apiData.set);
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

        //build query object
        const cardCollectionObject:CollectionCardTypeQuery =  {
            name: apiData.name,
            oracleId: apiData.oracle_id,
            colorIdentity: apiData.color_identity && apiData.color_identity.length > 0 ? apiData.color_identity : [],
            types,
            cardFaces
        }

        //optional cardObject values 
        'keywords' in apiData && apiData.keywords.length > 0 ?  cardCollectionObject.keywords = apiData.keywords : false;

        const versionId = apiData.id;
        //assign version values for query
        cardCollectionObject['versions.'+versionId+'.scryfallId'] = apiData.id;
        cardCollectionObject['versions.'+versionId+'.isPromo'] = apiData.promo;
        cardCollectionObject['versions.'+versionId+'.collectionNumber'] = collectorsData.number;
        cardCollectionObject['versions.'+versionId+'.rarity'] = apiData.rarity;
        cardCollectionObject['versions.'+versionId+'.prices'] = {regular: regularPrice, foil: foilPrice };
        cardCollectionObject['versions.'+versionId+'.set'] = set;
        cardCollectionObject['versions.'+versionId+'.images'] = images;

        //optional version values 
        'promo_types' in apiData ? cardCollectionObject['versions.'+versionId+'.promoTypes'] = apiData.promo_types: false;

        //quantity value for either regular or foil
        type == 'regular' 
        ? cardCollectionObject['versions.'+versionId+'.quantity.regular'] = quantity.regular 
        : cardCollectionObject['versions.'+versionId+'.quantity.foil'] = quantity.foil;

        return cardCollectionObject;
    }
}