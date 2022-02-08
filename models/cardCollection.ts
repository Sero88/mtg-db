import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";
import { ApiCard } from "../types/apiCard";
import { CardQuantity } from "../types/cardQuantity";
import { CardStatsType, ColorsSelectorType, SearchObject, SelectorListTypeItem } from "../types/searchTypes";
import { helpers } from "../util/helpers";
import { ColorConditionals, StatConditionalEnums } from "../util/enums/searchConditionals";
import { stats } from "../util/stats";
import { CollectionCardType, Version, VersionQuery } from "../types/collectionCard";


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

    private async isCardObjectUsed(card:ApiCard){
        const filter = {
            oracleId: card.oracle_id
        }
       
        const results = await this.db.collection(process.env.DATABASE_TABLE_VERSIONS).findOne(filter);
        
        return results && results.length ? true : false;
    }

    private async deleteCardVersion(card:ApiCard){
        const filter = {
            scryfallId: card.id,
        };

        const deleteResults = await this.db.collection(process.env.DATABASE_TABLE_VERSIONS).deleteOne(filter);

        if( !deleteResults.hasOwnProperty('deletedCount') ){
            return false;
        }

        /* //if there are no versions in the card object remove it from the db
        if('value' in results && 'versions' in results.value && Object.keys(results.value.versions).length == 0){
            await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
        } */
        

        //check to see if the card object is being used if not delete
        const isBeingUsed = await this.isCardObjectUsed(card);

        if( !isBeingUsed ){
            const cardFilter = {
                oracleId: card.oracle_id
            }
            await await this.db.collection(process.env.DATABASE_TABLE_CARDS).deleteOne(cardFilter);
        }
        
        //return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
        return deleteResults;
    }


    private async verifyConnection(){
        if(!this.db || !this.client || !this.client.isConnected()){
            return false;
        }

        return true;
    }  

    private async upsertCard(cardObject:CollectionCardType){
        const filter = {
            oracleId: cardObject.oracleId
        };

        const update = {
            $set: cardObject, 
        }

        const options = {
            upsert: true,
            returnDocument: 'after', 
        }
    
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);

        if('value' in results && results.value){
            return true;
        }
    }

    private async upsertVersion(versionObject:VersionQuery){
        const filter = {
            scryfallId: versionObject.scryfallId
        };

        const update = {
            $set: versionObject 
        }

        const options = {
            upsert: true,
            returnDocument: 'after', 
        }
    
        return await this.db.collection(process.env.DATABASE_TABLE_VERSIONS).findOneAndUpdate(filter, update, options);
    }

    private async setQuantityQuery(card:ApiCard, quantity:CardQuantity, type: string){

        const cardCollectionObject = CollectionCard.buildQueryObject(card, type);
        const versionObject = CollectionCard.buildVersionObject(card, quantity ,type)

        //create the card object if one does not exist already
        const upsertResults = await this.upsertCard(cardCollectionObject);

        if(!upsertResults){
            return false;
        }

        //update the version object
        return await this.upsertVersion(versionObject);

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
    private constructStatQueries(selectedStats:CardStatsType, queryObject: any){//todo add query object type here
        //continue adding different type of stat queries
        //define the stats above and only used the ones I set, not the ones passed by the props to prevent injection

        //this.getConditionalQuery(StatConditionalEnums.gt);

        stats.forEach(stat => {
            //check to see if the query field was selected and has a value
            
            const conditional = selectedStats[stat.name] && selectedStats[stat.name].hasOwnProperty('conditional') ? `$${StatConditionalEnums[selectedStats[stat.name].conditional]}` : null;
            const value = selectedStats[stat.name] && selectedStats[stat.name].hasOwnProperty('value') ? selectedStats[stat.name].value : null;

            //verify required query data is available
            if(value === null || conditional === null){
                return;
            }

            //only manaValue uses number values the rest use strings
            const convertedValue = stat.name == 'manaValue' && value !== undefined ? parseInt(value) : value;
            let queryField = `cardFaces.${stat.name}`;
            let queryValue: {}|[] = {[conditional]: convertedValue};

            //fields where 0 is used and is gte or eq, we need to include "*" values, because these are considered as 0
            // * is already < than 0 so no need to check for these when using lte = 0
            if( (selectedStats[stat.name].conditional== StatConditionalEnums.eq || selectedStats[stat.name].conditional == StatConditionalEnums.gte) && convertedValue === "0"){
                //example: {$or:[{'cardFaces.toughness':{$gte:"0"}}, {'cardFaces.toughness':{$eq:"*"}} ]}
                queryValue = {$or:[{[queryField]:{[conditional]:convertedValue}},{[queryField]:{$eq:"*"}}]};
                queryObject.hasOwnProperty('$and') ? queryObject.$and.push(queryValue) : queryObject.$and = [queryValue]; //add $or field to $and operator
            } else {
                queryObject[queryField] = queryValue;
            }

        });

        return queryObject;
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

        if('deletedCount' in deleteResults && deleteResults.deletedCount){
            const deletedVersion = {} as Version;
            deletedVersion.quantity = {regular: 0 , foil: 0}; //set the values to zero to front end status gets updated
            deletedVersion.scryfallId = card.id;
            return this.responseObject('Success removing card from collection.', deletedVersion);
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
        const projection = {projection:{scryfallId:1, quantity: 1}};
      
        //const results = await this.db.collection(process.env.DATABASE_TABLE_VERSIONS).find({$or:cardIdQuery}).limit(1).toArray();
        const results = await this.db.collection(process.env.DATABASE_TABLE_VERSIONS).find({scryfallId:{$in:cardIds}}, projection).toArray();

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
        let queryObject = {};

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

        if(searchObject.cardStats && Object.keys(searchObject.cardStats).length > 0){
            //todo: remove after completing searchObject functionality
            //@ts-ignore
            queryObject = this.constructStatQueries(searchObject.cardStats, queryObject);
        }


        //todo remove after testing 👇
        console.log('search form data: ', searchObject );
        //todo remove after testing 👆

        //todo remove after testing 👇
        console.log('searching query object:', queryObject );
        //todo remove after testing 👆

        //todo remove after testing 👇
        console.log('searching query object:', JSON.stringify(queryObject) );
        //todo remove after testing 👆

        const queryWithVersions = [  {
            $lookup:
                {
                    from: process.env.DATABASE_TABLE_VERSIONS,
                    localField: "oracleId",
                    foreignField: "oracleId",
                    as: "versions"
                }
            },
           /*  {
               // $match: {"versions.isPromo":true}
            }, */
            {
                $match: queryObject
            }           
        ]

       // {sort:{name: 1},projection: this.findProjection}
         
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).aggregate(queryWithVersions).toArray();

        return this.responseObject('success', results);

    }

    async getTypes(){
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).distinct("types");
        return this.responseObject('success', results);
    }

   async getSets(){
        let query = 
        {
            $lookup:
                {
                from: process.env.DATABASE_TABLE_CARDS,
                //let: { versions: "$versions"},
                pipeline: [
                    { $match:
                        {
                            distinct: process.env.DATABASE_TABLE_CARDS,
                            key: "versions"
                        }
                    },
                ],
                as: "versionsne"
                }
            }

        let query2 = { 'versions.$.set':/.+/i };

        let query3 = { $match:
            {
                distinct: process.env.DATABASE_TABLE_CARDS,
                key: "versions"
            }
        };
        

        let query4 = [
            {
                distinct: process.env.DATABASE_TABLE_CARDS,
                key: "versions"

            }
            
        ];

        let query5 = [
            {
                $group : { _id:"$versions" } 
            }, 
            {
                $group: {_id: "_id."}
            }
        ]

        let query6 = [  {
            $lookup:
              {
                from: process.env.DATABASE_TABLE_VERSIONS,
                localField: "oracleId",
                foreignField: "oracleId",
                as: "versions"
              }
         }]

        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).aggregate(query6).toArray();

        //todo remove after testing 👇
        console.log('results', results );
        //todo remove after testing 👆
 
        return this.responseObject('sucess', results);
    } 
}