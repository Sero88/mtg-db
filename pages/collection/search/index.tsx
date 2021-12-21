import { SearchName } from "../../../components/collection-search/name";
export default function Search(){

    const submitHandler = (event:React.FormEvent) => {
        
        //todo remove after testing 👇
        console.log('submit: ');
        //todo remove after testing 👆
    };

    return (
    <>
        <h1>Search Collection</h1>
        <form action="search/results/" onSubmit={submitHandler}>
            <SearchName />
            <input type="submit" value="Search"/>
        </form>  
    </>
    );
}