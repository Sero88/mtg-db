// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req});
    console.log('making call');

    //todo uncomment after you are done testing
    /* if(!session){
        res.status(401).send('You must be logged in');
    } */

    const apiUrl = 'https://api.scryfall.com';
    const {query} = req.query;    
    const results = await fetch(`${apiUrl}/cards/search/?q=${query}`);
    const jsonResults = await results.json();
    res.status(200).json(jsonResults);    
}


