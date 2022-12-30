import { ApiSet } from "../types/apiSet";

const officialSetCharLimit =  3; // official sets have 3 chars

export const allowedSets = [
    "core",
    "expansion",
    "masters",
    "draft_innovation"
    //"commander",
    //"promo",
];

export const setHelper = {
    getCardSet: function(apiSet: string){
        const set = apiSet.length > officialSetCharLimit ? apiSet.substring(1) : apiSet;
        return set;
    },

    isAllowedSet: function(set: ApiSet){
        return !set.digital && allowedSets.includes(set.set_type)
    },

    //this removes promos such as 'pvow' and just shows the actual expansion: 'vow'
    isAllowedSearchSet: function(set: ApiSet){
        return this.isAllowedSet(set) && set.code.length <= officialSetCharLimit;
    }

}