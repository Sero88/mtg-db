import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await fetch('https://data.scryfall.io/oracle-cards/oracle-cards-20221015090205.json');
    const body = await data.text();
    // const acceptId = ['08d1dd97-2675-4953-ab95-d47d23abfe05']
    try {
        fs.writeFileSync(path.join(process.cwd(),'/data/scryfall-default-cards.json'), body);
        const date = new Date();
        res.send('successfully saved data' + date.toDateString() );
    } catch(err) {
        console.error(err);
        res.status(500).json('something went wrong unable to save file - check the logs')
    }
    
}
