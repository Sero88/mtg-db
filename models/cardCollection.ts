import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";
import { ApiCard } from "../types/apiCard";
import { CardQuantity } from "../types/cardQuantity";
import { ColorsSelectorType, SearchObject, SelectorListTypeItem } from "../types/searchTypes";
import { helpers } from "../util/helpers";
import { ColorConditionals } from "../util/enums/colorEnums";


export class CardCollection{
    private client: any; //no types exists for these from the library
    private db: any;

    private updateProjection =  {
        scryfallId: 1, 
        quantity: {regular: 1, foil: 1},
        _id: 0
    }

    private findProjection = {
        _id: 0
    }

    private responseObject(status:string, data:{}) {
        return {
            status, 
            data
        }
    }

    private async deleteCardVersion(card:ApiCard){
        const filter = {
            oracleId: card.oracle_id
        };

        const update = { 
            $unset: { [`versions.${card.id}`]:''}
        };

        const options = {
            upsert: true,
            returnDocument: 'after', 
        }

        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);

        //if there are no versions in the card object remove it from the db
        if('value' in results && 'versions' in results.value && Object.keys(results.value.versions).length == 0){
            await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
        }
        
         //return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
        return results;
    }


    private async verifyConnection(){
        if(!this.db || !this.client || !this.client.isConnected()){
            return false;
        }

        return true;
    }  

    private async setQuantityQuery(card:ApiCard, quantity:CardQuantity, type: string){

        const cardCollectionObject = CollectionCard.buildQueryObject(card, quantity, type);

        const filter = {
            oracleId: card.oracle_id
        };

        console.log('update object: ', cardCollectionObject);

        const update = {
            $set: cardCollectionObject, 
        }

        const options = {
            upsert: true,
            returnDocument: 'after', 
        }
    
        return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);
    }

    private constructTextQuery(textToSearch: string){
 
        const uniqueText = helpers.getUniqueWords(textToSearch);

        //escape non-alphanumeric characters
        uniqueText.words.forEach((word) => {

            //replace any special chars
            const nonAlphaNumeric = /([^a-zA-Z0-9])/gim;
            const subs ='\\$1';
            const escapedWord = word.replace(nonAlphaNumeric, subs);

            //prepare the text for search
            uniqueText.text = uniqueText.text.replace(word,`${escapedWord}`);

        });

        // add OR pipelines - text search check if at least one word is in text
        uniqueText.text = uniqueText.text.replace(/\s/g, '|');

        //todo remove after testing 👇
        console.log('searching for:', uniqueText.text );
        //todo remove after testing 👆

        return new RegExp(uniqueText.text,'i');
    }

    private constructTypesQuery(types: SelectorListTypeItem[], allowTypePartials: boolean ){
        const isTypes:string[] = [];
        const notTypes:string[] = [];
        const query:{$all?:string[], $in?:string[], $nin?:string[]} = {};

        const inclusionType = allowTypePartials ? '$in' : '$all';

        types.forEach( type => {
            type.is ? isTypes.push(type.value) : notTypes.push(type.value);
        });

        isTypes.length > 0 ? query[inclusionType] = isTypes : false;
        notTypes.length > 0 ? query.$nin = notTypes : false;

        return query;
    }

    private constructColorsQuery(colorOptions: ColorsSelectorType) {

        //colorless cards use null (no color)
        if(colorOptions.selected.indexOf('null') >= 0 ){
            return null;
        }

        // example {colorIdentity: {$all:['B','R','U'], $size: 3}}
        const query:{$all?:string[], $in?:string[], $size?: number} = {};
        const inclusionType = colorOptions.conditional == ColorConditionals.exact || colorOptions.conditional == ColorConditionals.include ? '$all' : '$in';
        const includeSize = colorOptions.conditional == ColorConditionals.exact ? true : false;

        query[inclusionType] = colorOptions.selected;
        includeSize ? query.$size = colorOptions.selected.length : false;

        return query;
    }

    async dbConnect(){
        const {client, db} = await connectToDatabase();    
        this.client = client;
        this.db = db;
        const isConnected = await this.client.isConnected();

        if(!isConnected){
            return this.responseObject('error', 'No connection to db');
        }
        
        return true;
    }

    async removeCardVersion(card:ApiCard){
        
        //verify connection
        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }

        const deleteResults = await this.deleteCardVersion(card);
                
        if('value' in deleteResults && deleteResults.value){
            deleteResults.value.versions[card.id] = {quantity:{regular: 0 , foil: 0}}; //set the values to zero to front end status gets updated
            deleteResults.value.versions[card.id].scryfallId = card.id;
            return this.responseObject('Success removing card from collection.', deleteResults.value);
        }

        return this.responseObject('error', 'Something went wrong. Unable to complete remove action. Check server logs.');
    }

    async setQuantity(card:ApiCard, quantity:CardQuantity, type: string){
         //there are no cards to remove ignore 
         if( !(quantity.regular >= 0) || !(quantity.foil >= 0) ){
            return this.responseObject('error', 'Quantity can\'t be less than 0');
        }

        //if both quantities are now 0, remove card
        if(quantity.regular == 0 && quantity.foil == 0 ){
            return this.removeCardVersion(card);
        }

        //verify connection
        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }

        const results = await this.setQuantityQuery(card, quantity, type);

        if('value' in results && results.value){
            return this.responseObject('Success setting card quantity in collection.',  results.value);
        }

        return this.responseObject('error', 'Something went wrong. Unable to complete set action. Check server logs.');

    }

    async searchIds(cardIds:string[]){
       // const projection = {projection:{scryfallId:1, quantity: 1}};
      
        const cardIdQuery = cardIds.map( (cardId) => {
            return(
             {['versions.'+cardId]:{$exists:true}}
            )
        });

        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).find({$or:cardIdQuery}).limit(1).toArray();
         //const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).find({scryfallId:{$in:cardIds}}, projection).toArray();


        return this.responseObject('success', results);
    }
    
    async dailyFlavorTextSearch(){
        //const projection = {projection:{cardFaces:{flavorText:1}}}; projection is not an option for aggregate

        //match cards that have a flavor text
        const matchQuery = {
            $match: {
                cardFaces: { 
                    $elemMatch: { 
                        flavorText: { $exists: true } 
                    }
                }
            }
        }

        //using sample we retrieve a random card from the match query results
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).aggregate([matchQuery, {$sample:{size:1}}]).toArray();

        return this.responseObject('success', results[0]);
    }

    async getCards(searchObject: SearchObject){
        const queryObject = {};

        if(searchObject.cardName){
            //todo: remove after completing searchObject functionality
            //@ts-ignore
            queryObject.name = this.constructTextQuery(searchObject.cardName);
        }

        if(searchObject.cardText){
            //todo: remove after completing searchObject functionality
            //@ts-ignore
            queryObject['cardFaces.oracleText'] = this.constructTextQuery(searchObject.cardText);
        }

        if(searchObject.cardTypes && searchObject.cardTypes.items.length > 0){ 
            //todo: remove after completing searchObject functionality
            //@ts-ignore
            queryObject['types'] = this.constructTypesQuery(searchObject.cardTypes.items, searchObject.cardTypes.conditionals.allowPartials);
        }

        if(searchObject.cardColors && searchObject.cardColors.selected.length > 0){
            //todo: remove after completing searchObject functionality
            //@ts-ignore
            queryObject['colorIdentity'] = this.constructColorsQuery(searchObject.cardColors);
        }


        //todo remove after testing 👇
        console.log('search form data: ', searchObject );
        //todo remove after testing 👆

        //todo remove after testing 👇
        console.log('searching query object:', queryObject );
        //todo remove after testing 👆
         
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).find(queryObject, {sort:{name: 1},projection: this.findProjection}).toArray();

        return this.responseObject('success', results);

    }

    async getTypes(){
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).distinct("types");
        return this.responseObject('success', results);
    }
}