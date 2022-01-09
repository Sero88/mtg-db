// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req});


    if(!session){
        res.status(401).send('You must be logged in');
        return;
    }

    const apiUrl = 'https://api.scryfall.com';

    const results = await fetch(`${apiUrl}/symbology`);

    const jsonResults = await results.json();
    res.status(200).json(jsonResults);
}