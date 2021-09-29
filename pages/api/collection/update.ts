// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import {connectToDatabase} from "../../../util/mongodb";
import { helpers } from '../../../util/helpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    function buildCollectionCardObject(apiData){
        //prepare values
        const collectorsData = helpers.getCollectorsData(apiData);
        const types = helpers.getTypes(apiData);
        const cardFaces = helpers.getCardFacesValues(apiData);
        const set = helpers.getCardSet(apiData.set);
    
        const cardCollectionObject =  {
            scryfallId: apiData.id,
            name: apiData.name,
            colorIdentity: apiData.color_identity.length > 0 ? apiData.color_identity : null,
            set,
            isPromo: apiData.promo,
            artist: apiData.artist,
            rarity: apiData.rarity,
            collectionNumber: collectorsData.number,
            types,
            cardFaces
        }

        console.log('cardObject: ', cardCollectionObject);

        //optional values
        'loyalty' in apiData ? cardCollectionObject.loyalty = apiData.loyalty : false;
        'keywords' in apiData && apiData.keywords.length > 0 ? cardCollectionObject.keywords = apiData.keywords : false;
        'promo_types' in apiData ? cardCollectionObject.promoTypes = apiData.promo_types: false;

        return cardCollectionObject;
    }

    const updateProjection = {
        scryfallId: 1, 
        quantity: 1,
        _id: 0
    }

    async function addCard(card){
        const cardCollectionObject = buildCollectionCardObject(card);

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
            projection: updateProjection
        }
        
        const results = await db.collection(process.env.DATABASE_TABLE_CARDS).findOneAndUpdate(filter, update, options);

        console.log('after update: ', results);
        
        //verify card was added if not, return false 
        if('value' in results && results.value){
            return results.value;
        }
        
        return false;
    }

    function removeCard(card){
        
    }

    const session = await getSession({req});

    //todo uncomment after you are done testing
    /* if(!session){
        res.status(401).send('You must be logged in');
    } */
    
    //connect to Db
    const {client, db} = await connectToDatabase();    
    const isConnected = await client.isConnected();

    if(!isConnected){
        res.status(500).json('unable to connect to database');
        return;
    }

    const {card, action} = JSON.parse(req.body);
    
    switch (action){
        case 'add':
            const response = await addCard(card);
            response
                ? res.status(200).json(helpers.collectionApiResponse('success', 'card was added successfully to collection', response))
                : res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to add card to collection check server logs'));
            break;

        case 'remove':
            removeCard(card);
            break;
    }
    
}
