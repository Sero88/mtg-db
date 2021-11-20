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
    const {query, unique, order, page} = req.query;    
    //?order=released&q=elvish&unique=prints
    const apiQuery = query + ' game:paper';
    const uniquePrintsQuery = unique ? '&unique=prints': '';
    const orderQuery = order ? `&order=${order}&dir=asc` : '&order=released&dir=asc'; //direction ascending 1 to XX
    const pageQuery = page ? `&page=${page}` : '&page=1';
    const results = await fetch(`${apiUrl}/cards/search/?q=${apiQuery}${orderQuery}${uniquePrintsQuery}${pageQuery}`);
    

    const jsonResults = await results.json();
    res.status(200).json(jsonResults);    
}


