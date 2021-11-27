import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";
import { ApiCard } from "../types/apiCard";
import { CardQuantity } from "../types/cardQuantity";


export class CardCollection{
    private client: any; //no types exists for these from the library
    private db: any;

    private updateProjection =  {
        scryfallId: 1, 
        quantity: 1,
        quantityFoil: 1,
        _id: 0
    }

    private responseObject(status:string, data:{}) {
        return {
            status, 
            data
        }
    }

    private async deleteCard(card:ApiCard){
        const filter = {
            scryfallId: card.id
        };
        return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
    }


    private async verifyConnection(){
        if(!this.db || !this.client || !this.client.isConnected()){
            return false;
        }

        return true;
    }  

    private async setQuantityQuery(card:ApiCard, quantity:CardQuantity){

        const cardCollectionObject = CollectionCard.buildObject(card, quantity);

        const filter = {
            scryfallId: card.id
        };

        const update = {
            $set: cardCollectionObject, 
        }

        const options = {
            upsert: true,
            returnDocument: 'after', 
            projection: this.updateProjection
        }
    
        return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);
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

    async removeCard(card:ApiCard){
        
        //verify connection
        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }

        const deleteResults = await this.deleteCard(card);
                
        if('value' in deleteResults && deleteResults.value){
            deleteResults.value.quantity = 0;
            deleteResults.value.quantityFoil = 0;
            return this.responseObject('success', deleteResults.value);
        }

        return this.responseObject('error', 'Something went wrong. Unable to complete remove action. Check server logs.');
    }

    async setQuantity(card:ApiCard, quantity:CardQuantity){
         //there are no cards to remove ignore 
         if( !(quantity.regular >= 0) || !(quantity.foil >= 0) ){
            return this.responseObject('error', 'Quantity can\'t be less than 0');
        }

        //if both quantities are now 0, remove card
        if(quantity.regular == 0 && quantity.foil == 0 ){
            return this.removeCard(card);
        }

        //verify connection
        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }

        const results =  await this.setQuantityQuery(card, quantity);

        if('value' in results && results.value){
            return this.responseObject('success',  results.value);
        }

        return this.responseObject('error', 'Something went wrong. Unable to complete set action. Check server logs.');

    }

    async searchIds(cardIds:string[]){
        const projection = {projection:{scryfallId:1, quantity: 1}};
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).find({scryfallId:{$in:cardIds}}, projection).toArray();

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
}