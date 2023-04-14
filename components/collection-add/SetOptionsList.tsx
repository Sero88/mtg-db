import { ApiSet } from "@/types/apiSet";
import { setHelper } from "@/util/sets";
import { ReactElement } from "react";
export function SetOptionsList({setsData}:{setsData:ApiSet[]}){
    if(!setsData){
        return null;
    }

    const setList: ReactElement[] = [];
    
    setsData?.forEach( (set:ApiSet) => {
        if( setHelper.isAllowedSearchSet(set) ){
            setList.push(
                <option value={set.code} key={`set${set.code}`}>
                    {set.name}
                </option>
            );
        }                             
    })

    return (<>{setList}</>);
    
}