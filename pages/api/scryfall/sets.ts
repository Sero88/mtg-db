// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req});

    //todo uncomment after you are done testing
    /* if(!session){
        res.status(401).send('You must be logged in');
    } */

    const apiUrl = 'https://api.scryfall.com';

    console.log(`making call: ${apiUrl}/sets`);
    const results = await fetch(`${apiUrl}/sets`);

    const jsonResults = await results.json();
    res.status(200).json(jsonResults);
}