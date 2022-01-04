// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { helpers } from '../../../util/helpers';
import { CardCollection } from '../../../models/cardCollection';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({req});

    if(!session){
        res.status(401).send('You must be logged in');
        return;
    }

    const cardCollection = new CardCollection();
    const isConnected = await cardCollection.dbConnect();

    if(!isConnected){
        res.status(500).json('unable to connect to database');
        return;
    }

    const setResponse = await cardCollection.updateDb();

    res.status(200).json(helpers.collectionApiResponse('success', setResponse.status,{update:'Done on 1/4/2022'}));

    /* ('status' in setResponse && setResponse.status == 'error') || !('data' in setResponse)
        ? res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to set card quantity in collection'))
        : res.status(200).json(helpers.collectionApiResponse('success', setResponse.status, setResponse.data)); */
}
