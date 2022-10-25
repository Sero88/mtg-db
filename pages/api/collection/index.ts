import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { CardCollection } from '../../../models/cardCollection';
import { ApiResponseEnum } from '../../../util/enums/responseEnums';
import { helpers } from '../../../util/helpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({req});
   
    if(!session){
       res.status(401).send('You must be logged in.');
       return;
    }
    
    const cardCollection = new CardCollection();
    const isConnected = await cardCollection.dbConnect();

    if(!isConnected){
        res.status(500).send('unable to connect to database');
        return;
    }

    const allCardsResult = await cardCollection.getAllCardsWithVersions();

    if(allCardsResult.status == ApiResponseEnum.success){
        res.status(200).json(allCardsResult.data);
    } else {
        res.status(400).send(helpers.collectionApiResponse('error', 'Unable to get data.'));
    }

}
