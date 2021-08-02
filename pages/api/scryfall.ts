// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiUrl = 'https://api.scryfall.com';
    const {cardName} = req.query;
    console.log('searching cards: ' + cardName);
    const results = await fetch(`${apiUrl}/cards/search/?q=${cardName}`);
    const jsonResults = await results.json();
    res.status(200).json(jsonResults);
    
}


