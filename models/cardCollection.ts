import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";
import { apiCard } from "../types/apiCard";

export class CardCollection{
    private client;
    private db;

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
    
    private async decreaseCard(card:apiCard){
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

    private async deleteCard(card:apiCard){
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

    async addCard(card: apiCard){

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

    async removeCard(card:apiCard, quantity: number){
        //there are no cards to remove ignore 
        if(!quantity){
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
        return this.responseObject('error', 'Something went wrong. Unable to complete remove action. Check server logs.');;
    }
}