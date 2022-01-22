
type SearchNameProps = {
    fieldName: string,
    fieldValue: string,
    changeHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchName({changeHandler, fieldName, fieldValue}:SearchNameProps){
    return (
        <label>
            <input name={fieldName} onChange={changeHandler} value={fieldValue} autoComplete="off" />
            <br />
            Card name
        </label>
    );
}