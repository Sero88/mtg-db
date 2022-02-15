import styles from "../../styles/colorSearch.module.scss";
import { CardRarityEnum } from "../../util/enums/rarityEnums";

type RaritySearchProps = {
    changeHandler:  (event: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => void,
    checkboxFieldName: string,
    selectedItems: string[],
}


export function SearchRarity({changeHandler, checkboxFieldName, selectedItems}:RaritySearchProps){

    const rarities = [];

    for(const rarityEnum in CardRarityEnum){
        const rarity = parseInt(rarityEnum);
       
        //verify rarity has a number value (from enum)
        if(isNaN(rarity)){
            continue;
        }

        //create the checkboxes
        rarities.push(
            <label key={rarity}>
                <input type="checkbox" data-value={rarity} checked={selectedItems.includes(String(rarity))} name={checkboxFieldName} onChange={changeHandler}/>
                <span>{rarity == CardRarityEnum.specialBonus ? "Special/Bonus" : CardRarityEnum[rarity]}</span>
            </label>     
        ); 
    }
    

    return (
        <div>
            <div className={styles.colorChoices}>
                {
                    rarities
                }
            </div>
        </div>
        
    );
}