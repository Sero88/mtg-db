// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import {connectToDatabase} from "../../../util/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
  
    console.log('cards', req.body);
    res.status(200).json(req.body);
}


