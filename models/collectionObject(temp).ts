import {connectToDatabase} from "../util/mongodb";
import { CollectionCard } from "../util/collectionCard";


//these functions are outside of object so they can remain private
async function decreaseCard(db, card){
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
        projection: updateProjection
    }

    return await db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);
}

async function deleteCard(db, card){
    const filter = {
        scryfallId: card.id
    };
    return await db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndDelete(filter);
}

export const CardCollection = {
    client: null,
    db: null,

    updateProjection: {
        scryfallId: 1, 
        quantity: 1,
        _id: 0
    },

    responseObject: function(status:string, data) {
        return {
            status, 
            data
        }
    }, 

    dbConnect: async function(){
        const {client, db} = await connectToDatabase();    
        this.client = client;
        this.db = db;
        const isConnected = await this.client.isConnected();

        if(!isConnected){
            return this.responseObject('error', 'No connection to db');
        }
        
        return true;
    },

    verifyConnection: async function(){
        if(!this.db || !this.client || !this.client.isConnected()){
            return false;
        }

        return true;
    },


    addCard: async function(card){

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
    },

    removeCard: async function(card, quantity){
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
                const decreaseResults = await decreaseCard(this.db, card);    

                if('value' in decreaseResults && decreaseResults.value){
                    return decreaseResults.value;
                }
            break;

            case 'delete': 
                const deleteResults = await deleteCard(this.db, card);
                
                if('value' in deleteResults && deleteResults.value){
                    deleteResults.value.quantity = 0;
                    return deleteResults.value;
                }
            break;

        }
        return this.responseObject('error', 'Something went wrong. Unable to complete remove action. Check server logs.');;
    }
}