// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { CardCollection } from '../../../models/cardCollection';
import { ApiResponseEnum } from '../../../util/enums/responseEnums';
import { helpers } from '../../../util/helpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({req});
   
    if(!session){
       res.status(401).json('You must be logged in.');
       return;
    }
    
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
        case 'cardsTotal': 
     
            const searchResults = await cardCollection.getAllCards();

            if(searchResults.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Collection data retrieved successfully', searchResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get data.'));
            }

        break;

        default:
            res.status(400).json(helpers.collectionApiResponse('error', 'Unable to perform action'));
    }

}
