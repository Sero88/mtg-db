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

    const {card, action, quantity} = JSON.parse(req.body);
    
    switch (action){
        case 'add':
            const addResponse = await cardCollection.addCard(card);

            'status' in addResponse && addResponse.status == 'success' && 'data' in addResponse
                ? res.status(200).json(helpers.collectionApiResponse('success', 'card was added successfully to collection', addResponse.data))
                : res.status(400).json(helpers.collectionApiResponse('error', 'Something went wrong, unable to add card to collection check server logs'));
            break;

        case 'remove':
            const removeResponse = await cardCollection.removeCard(card, quantity);
            'status' in removeResponse && removeResponse.status == 'success' && 'data' in removeResponse
                ? res.status(200).json(helpers.collectionApiResponse('success', 'card was decreased/removed successfully from collection', removeResponse.data))
                : res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to remove card to collection check server logs'));
            break;

        case 'set': 
            const setResponse = await cardCollection.setQuantity(card, quantity);
            'status' in setResponse && setResponse.status == 'success' && 'data' in setResponse
                ? res.status(200).json(helpers.collectionApiResponse('success', 'card quantity was successfully set in collection', setResponse.data))
                : res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to set card quantity in collection'));
            break;

        default:
            res.status(400).json(helpers.collectionApiResponse('error','unable to perform action'));
    }
    
}
