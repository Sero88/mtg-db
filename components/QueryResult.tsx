import LoaderAnimation from "./loader-animation";
import { QueryResultProps } from "../types/queryResult";

export function QueryResult ( {queryResult, children, errorMessage="Something went wrong. Please try again"}: QueryResultProps ){
    if(queryResult.isLoading){
        return <LoaderAnimation />
    }
    
    if(queryResult.error){
        return <p>{errorMessage}</p>
    }

    if(queryResult.data){
        return children
    }

    return null;

}