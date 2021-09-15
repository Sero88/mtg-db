// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import {connectToDatabase} from "../../../util/mongodb";
import { helpers } from '../../../util/helpers';


function apiResponse(status, message){
    return {
        status,
        message
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    async function addCard(card){
        const filter = {
            scryfallId: card.id
        };

        const update = {
            $set: {
                name: card.name,
                collectorNumber: card.collector_number,
                set: card.set_name
            }, 
            $inc: {
                qty: 1,
            }
        }

        const options = {
            upsert: true
        }
        
        const results = await db.collection(process.env.DATABASE_TABLE_CARDS).updateOne(filter, update, options);
        
        //verify card was added if not, return false 
        if( !('result' in results) || !('n' in results.result) || results.result.n < 1){
            return false;
        }
        
        return true;
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
            addCard(card)
            .then((response) => {
                response 
                    ? res.status(200).send(apiResponse('success', 'card was added successfully to collection'))
                    : res.status(401).send(apiResponse('error', 'something went wrong, unable to add card to collection check server logs'));
            })
            .catch( e => console.error(e));
            break;

        case 'remove':
            removeCard(card);
            break;
    }
    
}
