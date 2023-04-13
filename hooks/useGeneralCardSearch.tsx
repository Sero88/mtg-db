import {useQuery} from 'react-query';
import { SearchCardData } from '../types/addPage';
import axios from 'axios';
import { ApiCard } from '../types/apiCard';

type useGeneralCardSearchProps = {
    searchCardData: SearchCardData,
    page: number,

}

export function useGeneralCardSearch({searchCardData, page}:useGeneralCardSearchProps ){

    return useQuery( `get:${searchCardData.cardName}${searchCardData.setCode}` , async () => {
        
        if(!searchCardData.cardName && !searchCardData.setCode ){
            return undefined;
        }

        const setParam = searchCardData.setCode 
            ? ` set:${searchCardData.setCode},s${searchCardData.setCode},p${searchCardData.setCode}` 
            : '';

        const searchEndpoint = '/api/scryfall/cards/?query=' + encodeURIComponent(searchCardData.cardName + setParam) + "&page=" + page;
        
        const response = await axios.get(searchEndpoint)
        
        return response?.data?.data as ApiCard[]
        
    })
}