import { ApiResultsList } from "../types/apiResultsList";
import styles from "../styles/pagination.module.scss";

type PaginationProps = {
    apiResults: ApiResultsList,
    updatePageResults: (page:number) => void,
    currentPage: number
}
export function Pagination({apiResults, updatePageResults, currentPage}:PaginationProps){
    //`${apiReturnLimit} of ${apiResults.total_cards}`
    const amountPerPage = apiResults.data.length;
    let pageQuantity = apiResults.has_more ? Math.ceil( apiResults.total_cards / amountPerPage) : currentPage;

    const listItems = [];
    for(let i = 1; i <= pageQuantity; i++){
        listItems.push(<li key={i} onClick={(e) => updatePageResults(i)} className={styles.pageItem}>{i} </li>);
    }

    return (
        <ul>
            {listItems}
        </ul>
    )
    

}