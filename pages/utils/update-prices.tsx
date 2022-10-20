import { GetServerSideProps } from 'next';
import { Version} from '../../types/collectionCard'
import { ApiCard } from '../../types/apiCard';

import fs from 'fs';
import path from 'path';
export default function UpdatePrices ({collectionCardVersions}:{collectionCardVersions:Version[]}) {

    //map the cards from scryfall so we can get them by Id
    // const mappedCards = new Map();
    // for(let i=0; i < scryfallCards.length; i++){
    //     mappedCards.set(scryfallCards[i].id, scryfallCards[i].prices);
    // }

    console.log('test: ', collectionCardVersions);


    // db.inventory.updateOne(
    //     { item: "paper" },
    //     {
    //       $set: { "size.uom": "cm", status: "P" },
    //       $currentDate: { lastModified: true }
    //     }
    //  )

    //

    // const minCut = scryfallCards.slice( i , scryfallCards.length);

    // console.log('min cut: ', minCut.length)
    // console.log('vs ', scryfallCards.length)
    

    //const firstHalf = scryfallCards.slice(0, scryfallCards.length / 4);
   // const lastQuarter  = scryfallCards.slice((scryfallCards.length/4, scryfallCards.length);

 
    // for(let i = 0; i < 10 ; i++){
    //     console.log(scryfallCards[i].released_at);
    // }

    return null;
    // return (
    //     scryfallCards.map( (card: ApiCard, index:number) => {
    //         if(count <=0){
    //             return (
    //                 <p key={index}>{card.name}</p>
    //             )
    //         }

    //         count++;
            
    //         return;
    //     })
    // )
}

export const getServerSideProps:GetServerSideProps = async (context) => {

    const bulkResponse= await fetch('https://api.scryfall.com/bulk-data/default-cards/?format=json');
    const bulkOptions = await bulkResponse.json();

    const cardResponse = await fetch(bulkOptions.download_uri);
    const scryfallCards = await cardResponse.text();

    try {
        fs.writeFileSync(path.join(process.cwd(),'/public/data/scryfall-default-cards.json'), scryfallCards);
        console.log('done')
    } catch(err) {
        console.error(err);
    }
    
    const collectionResponse = await fetch('http://localhost:3000/api/collection/reports?action=cardsTotal')
    const {data} = await collectionResponse.json();

    const props = {collectionCardVersions: data};
    return {props};
}