// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import {connectToDatabase} from "../../../util/mongodb";
import { helpers } from '../../../util/helpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({req});

    //todo uncomment after you are done testing
    /* if(!session){
        res.status(401).send('You must be logged in');
    } */
    
    const {client, db} = await connectToDatabase();    
    const isConnected = await client.isConnected();

    if(!isConnected){
        res.status(500).json('unable to connect to database');
        return;
    }

    const {cards} = JSON.parse(req.body);

    console.log('getting cards from collection: ', cards);

    const projection = {projection:{scryfallId:1, quantity: 1}};
    const results = await db.collection(process.env.DATABASE_TABLE_CARDS).find({scryfallId:{$in:cards}}, projection).toArray();

    res.status(200).json(helpers.collectionApiResponse('success', 'collection data retrieved successfully', results));
}


