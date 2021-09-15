export const helpers = {
    getCardUniqueIdentifier: function(card){
        return (`${card.name}_${card.set_name}_${card.collector_number}`);
    }
}