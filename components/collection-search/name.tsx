
type SearchNameProps = {
    name: any
    changeHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void
}
export function SearchName({changeHandler, name}:SearchNameProps){
    return (
        <label>
            <input name="cardName" onChange={changeHandler} value={name} />
            <br />
            Card name
        </label>
    );
}