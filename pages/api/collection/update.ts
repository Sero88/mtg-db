// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { helpers } from '../../../util/helpers';
import { CardCollection } from '../../../models/cardCollection';
import { ApiResponseEnum } from '../../../util/enums/responseEnums';


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

    const {action} = JSON.parse(req.body);
    
    switch (action){
        case 'set': 
            const {card, quantity, type} = JSON.parse(req.body);
            const setResponse = await cardCollection.setQuantity(card, quantity, type);
            ('status' in setResponse && setResponse.status == ApiResponseEnum.error) || !('data' in setResponse)
                ? res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to set card quantity in collection'))
                : res.status(200).json(helpers.collectionApiResponse('success', ApiResponseEnum[ApiResponseEnum.success], setResponse.data));

            break;
            
        case 'updatePrices':
            const {scryfallId, prices} = JSON.parse(req.body);
            const updateResponse = await cardCollection.updatePrices(scryfallId, prices);
            ('status' in updateResponse && updateResponse.status == ApiResponseEnum.error) || !('data' in updateResponse)
            ? res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to update price'))
            : res.status(200).json(helpers.collectionApiResponse('success', ApiResponseEnum[ApiResponseEnum.success], updateResponse.data));

            break;
        default:
            res.status(400).json(helpers.collectionApiResponse('error','unable to perform action'));
    }
    
}
