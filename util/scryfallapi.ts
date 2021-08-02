export default class ScryfallApi{
    private apiUrl = 'https://api.scryfall.com';

    async searchCards(cardName:string){
        console.log('searching cards: ' + cardName);
         const results = await fetch(`${this.apiUrl}/cards/search/?q=${cardName}`);
         console.log(results);
         return results;
        
    }
}