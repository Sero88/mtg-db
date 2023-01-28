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

    const action = req?.body ? JSON.parse(req.body)?.['action'] : req.query?.action;
    
    switch (action){
        case 'count': 
            const versionCount = await cardCollection.countVersions();
            ('status' in versionCount && versionCount.status == ApiResponseEnum.error) || !('data' in versionCount)
                ? res.status(400).json(helpers.collectionApiResponse('error', 'something went wrong, unable to get version count'))
                : res.status(200).json(helpers.collectionApiResponse('success', ApiResponseEnum[ApiResponseEnum.success], versionCount.data));
            break;

        default:
            return res.status(400).send('Bad Request')
    }
    
}
