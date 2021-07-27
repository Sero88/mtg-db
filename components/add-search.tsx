type searchCard = {
    cardSearchText: string,
    cardSearchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export default function SearchByName({cardSearchHandler, cardSearchText}: searchCard){
    return (
        <>
           <label>Card Name: <input type="text" name="cardName" onChange={cardSearchHandler} value={cardSearchText}/></label>
        </>
    );    
}