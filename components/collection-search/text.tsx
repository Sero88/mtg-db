
import {AddSymbol} from './addSymbol';

type SearchNameProps = {
    text: string,
    changeHandler:  (event: React.ChangeEvent<HTMLInputElement>) => void,
    clickHandler:  (event: React.MouseEvent<Element, MouseEvent>) => void,
}

export function SearchText({changeHandler,clickHandler, text}:SearchNameProps){

    return (
        <>
            <label>
                <input name="cardText" onChange={changeHandler} value={text} autoComplete="off" />
                <br />
                Text
            </label>
            <AddSymbol currentText={text} clickHandler={clickHandler} />
        </>
    );
}