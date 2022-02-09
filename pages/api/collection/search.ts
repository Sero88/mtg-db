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
        case 'searchIds': 
            const jsonCardIds = 'cardIds' in params ? params.cardIds : '';
            const cardIds = jsonCardIds ? JSON.parse(jsonCardIds) : [];
            if(!cardIds){
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to perform action'));
            }
            
            const searchResults = await cardCollection.searchIds(cardIds);

            if(searchResults.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Collection data retrieved successfully', searchResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get data.'));
            }

        break;

        case 'dailyFlavorText':
            const flavorTextResponse = await cardCollection.dailyFlavorTextSearch();
            if(flavorTextResponse.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Flavor text retrieved successfully', flavorTextResponse.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get data.'));
            }
        break;

        case 'searchQuery':

            const {searchQuery} = JSON.parse(req.body);

            //get the cards from db
            const searchQueryResults = await cardCollection.getCards(searchQuery);

            if(searchQueryResults.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Flavor text retrieved successfully', searchQueryResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get search data.'));
            }
        break;

        case 'getTypes':
            //get the cards from db
            const typeResults = await cardCollection.getTypes();

            if(typeResults.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Types retrieved successfully', typeResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get search data.'));
            }
        break;

        case 'getSets':
            //get the cards from db
            const setResults = await cardCollection.getSets();

            if(setResults.status == ApiResponseEnum.success){
                res.status(200).json(helpers.collectionApiResponse('success', 'Sets retrieved successfully', setResults.data));
            } else {
                res.status(400).json(helpers.collectionApiResponse('error', 'Unable to get set data.'));
            }
        break;

        default:
            res.status(400).json(helpers.collectionApiResponse('error', 'Unable to perform action'));
    }

}
