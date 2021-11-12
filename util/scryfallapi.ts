export default class ScryfallApi{
    private apiUrl = 'https://api.scryfall.com';

    async searchCards(cardName:string){
         const results = await fetch(`${this.apiUrl}/cards/search/?q=${cardName}`);
         return results;
        
    }
}