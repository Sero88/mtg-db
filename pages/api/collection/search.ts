// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { CardCollection } from '../../../models/cardCollection';
import { helpers } from '../../../util/helpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({req});

    //todo uncomment after you are done testing
    /* if(!session){
        res.status(401).send('You must be logged in');
    } */
    
    const cardCollection = new CardCollection();
    const isConnected = await cardCollection.dbConnect();

    if(!isConnected){
        res.status(500).json('unable to connect to database');
        return;
    }

    type ReqQueryParams = {
        cardIds?: string,
        action: string
    }

    const params = req.query as ReqQueryParams;

    const action = 'action' in params ?  params.action : '';

    switch (action){
        case 'searchIds': 
            const jsonCardIds = 'cardIds' in params ? params.cardIds : '';
            const cardIds = jsonCardIds ? JSON.parse(jsonCardIds) : [];
            if(!cardIds){
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to perform action'));
            }
            
            const searchResults = await cardCollection.searchIds(cardIds);

            if(searchResults.status == "success"){
                res.status(200).json(helpers.collectionApiResponse('success', 'Collection data retrieved successfully', searchResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get data.'));
            }

        break;

        case 'dailyFlavorText':
            const flavorTextResponse = await cardCollection.dailyFlavorTextSearch();
            if(flavorTextResponse.status == "success"){
                res.status(200).json(helpers.collectionApiResponse('success', 'Flavor text retrieved successfully', flavorTextResponse.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get data.'));
            }
        break;

        default:
            res.status(400).json(helpers.collectionApiResponse('error', 'Unable to perform action'));
    }

}
