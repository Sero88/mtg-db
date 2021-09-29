export const helpers = {
    getCardUniqueIdentifier: function(card){
        return (`${card.name}_${card.set_name}_${card.collector_number}`);
    },

    collectionApiResponse: function(status, message, data = []){
        return {
            status,
            message, 
            data
        }
    },

    getCollectorsData: function(apiCardData){
        //get the collector number
        const findLetterRegex = /[a-z]+/gi;
        const regex = new RegExp(findLetterRegex);
        const regexResult = regex.exec(apiCardData.collector_number);
        const collectionPromoType = regexResult && '0' in regexResult ?  regexResult[0] : '';
        const collectorNumber = collectionPromoType ? apiCardData.collector_number.replace(collectionPromoType,'') : apiCardData.collector_number;
        const collectionType = {
            s: 'pre-release',
            p: 'promo'
        };

        const collectionText = collectionPromoType && collectionPromoType in collectionType ? collectionType[collectionPromoType] : '';

        return {
            number: collectorNumber,
            type: collectionText
        }
    },

    convertManaCost: function (manaCost){
        const numberRegex =/[0-9]/g;
        const numberLetterComboRegex = /[0-9]\/[A-Z]/g;
        const colorsRegex = /(?![X])[A-Z](\/[A-Z])*/gm; //ignore X values
        const manaNoNumberColorCombo = manaCost.replace(numberLetterComboRegex, ''); //remove any with number/letter combinations, those count as number only (alread counted above)
        const allNumbers = manaCost.match(numberRegex);
        const allColors = manaNoNumberColorCombo.match(colorsRegex);

        const addValuesReducer = (prevValue, currentValue) => prevValue + parseInt(currentValue, 10);
       
        //add the mana value from numbers and colors
        let manaValue = allNumbers ? allNumbers.reduce(addValuesReducer, 0) : null;
        manaValue = allColors ? allColors.length + manaValue : manaValue;

        return manaValue;
    },

    getTypes: function(apiCardData){
        const typeLineString = apiCardData.type_line ? apiCardData.type_line.replace(/(—\s)|(\/\s?)+/g,''): ''; //replace "-" or "/"
        const typesArray = typeLineString.split(' ');

        const types = [];
        typesArray.forEach( type => {
            if(!types.includes(type)){
                types.push(type);
            }
        });

        return types;

    },

    getCardFacesValues: function(apiCardData){
        const cardFaces = [];
        const cardFaceType = ('card_faces' in apiCardData) ? 'multiface' : 'normal';

        
        //multiface values
        if(cardFaceType == 'multiface'){
            apiCardData.card_faces.forEach( (cardFace, faceIndex) => {
                cardFaces.push(this.assignCardFaceValues(faceIndex, apiCardData, cardFace));
            });
        } else {
            cardFaces.push(this.assignCardFaceValues(0, apiCardData));
        }

        return cardFaces;
    },

    assignCardFaceValues: function( faceIndex, apiCardData, cardFace = null){
        cardFace = cardFace ?? apiCardData;
        const faceObject = {};
        faceObject.manaValue = this.convertManaCost(cardFace.mana_cost);
        faceObject.oracleText = 'oracle_text' in cardFace && cardFace.oracle_text ? cardFace.oracle_text : null;
 
        //not all multiface images have an image on each face. Kitsune Ascendad is a multiface card with only one image, the image is in the main card info not on either face
        faceObject.imageUri = 'image_uris' in cardFace && cardFace.image_uris.normal ? cardFace.image_uris.normal : null;
        faceObject.imageUri = !faceObject.imageUri && faceIndex == 0 && 'image_uris' in apiCardData && apiCardData.image_uris.normal ? apiCardData.image_uris.normal : faceObject.imageUri ;
        
        //these are optional since not all cards have these
        'power' in cardFace && cardFace.power ? faceObject.power = cardFace.power : false;
        'toughness' in cardFace && cardFace.toughness ? faceObject.toughness = cardFace.toughness : false;
        'flavor_text' in cardFace && cardFace.flavor_text ? faceObject.flavor_text = cardFace.flavor_text : false;

        return faceObject;
    },

    getCardSet: function(apiSet){
        const officialSetCharLimit = 3; //sets have a limit of 3 chars

        const set = apiSet.length > officialSetCharLimit ? apiSet.substring(1) : apiSet;

         //remove the prefix "p" for promos, we're treating it as part of the regular ses
        // const promoPrefixRegex = /[p]+/;
        // set = 'kah';
        // console.log(set.match(promoPrefixRegex));

       // set.replace(promoPrefixRegex, '');


        return set;
    }
}