import LoaderAnimation from "./loader-animation";
import { QueryResultProps } from "../types/queryResult";

export function QueryResult ( {queryResult, children}: QueryResultProps ){
    if(queryResult.isLoading){
        return <LoaderAnimation />
    }
    
    if(queryResult.error){
        return <p>Something went wrong. Please try again.</p>
    }

    if(queryResult.data){
        return children
    }

    return null;

}