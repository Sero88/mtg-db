import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";
import { ApiCard } from "../types/apiCard";


export class CardCollection{
    private client: any; //no types exists for these from the library
    private db: any;

    private updateProjection =  {
        scryfallId: 1, 
        quantity: 1,
        _id: 0
    }

    private responseObject(status:string, data:{}) {
        return {
            status, 
            data
        }
    }
    
    private async decreaseCard(card:ApiCard){
        const filter = {
            scryfallId: card.id
        };
    
        const update = {
            $inc: {
                quantity: -1,
            }
        }
    
        const options = {
            returnDocument: 'after', 
            projection: this.updateProjection
        }
    
        return await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);
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

    private async setQuantityQuery(card:ApiCard, quantity: number){

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

    async addCard(card: ApiCard){

        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }
       
        const cardCollectionObject = CollectionCard.buildObject(card);

        const filter = {
            scryfallId: card.id
        };

        const update = {
            $set: cardCollectionObject, 
            $inc: {
                quantity: 1,
            }
        }

        const options = {
            upsert: true,
            returnDocument: 'after', 
            projection: this.updateProjection
        }
        
        const results = await this.db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);
        
        //verify card was added if not, return false 
        if('value' in results && results.value){
            return this.responseObject('success', results.value);
        }
        
        return this.responseObject('error', 'Unable to add card to collection');
    }

    async removeCard(card:ApiCard, quantity: number){
        //there are no cards to remove ignore 
        if(!quantity && quantity !== 0){
            return this.responseObject('error', 'Remove action missing quantity');
        }

        //verify connection
        if(!this.verifyConnection()){
            return this.responseObject('error', 'No db set. No connection to db');
        }

        //updating the quantity depends how many we already have
        const updateAction = quantity > 1 ? 'decrease' : 'delete';

        switch (updateAction){
            case 'decrease':
                const decreaseResults = await this.decreaseCard(card);    

                if('value' in decreaseResults && decreaseResults.value){
                    return this.responseObject('success',  decreaseResults.value);
                }
            break;

            case 'delete': 
                const deleteResults = await this.deleteCard(card);
                
                if('value' in deleteResults && deleteResults.value){
                    deleteResults.value.quantity = 0;
                    return this.responseObject('success', deleteResults.value);
                }
            break;

        }
        return this.responseObject('error', 'Something went wrong. Unable to complete remove action. Check server logs.');
    }

    async setQuantity(card:ApiCard, quantity: number){
         //there are no cards to remove ignore 
         if( quantity < 0 ){
            return this.responseObject('error', 'Quantity can\'t be less than 0');
        }

        if(quantity == 0 ){
            return this.removeCard(card, quantity);
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