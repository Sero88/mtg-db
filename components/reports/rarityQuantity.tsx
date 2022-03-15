import { CardRarityEnum } from "../../util/enums/rarityEnums";

export function QuantityRarityTable({reportData}:{reportData:{[key:string]:any}}){
    const rarityHeaders = [];
    const quantityByRarities = [];
    let index = 0;
    for(let rarityEnum in CardRarityEnum){
        
        if( !isNaN(parseInt(rarityEnum)) ){
            continue;
        }

        if(rarityEnum == CardRarityEnum[CardRarityEnum.specialBonus]){
            rarityEnum = 'special';
            //@ts-ignore
            quantityByRarities.push(<td key={index}>{reportData.quantity.rarity[rarityEnum]}</td>);
            rarityHeaders.push(<th key={index}>{rarityEnum}</th>)

            index++;

            rarityEnum = 'bonus';
            //@ts-ignore
            quantityByRarities.push(<td  key={index}>{reportData.quantity.rarity[rarityEnum]}</td>);
            rarityHeaders.push(<th key={index}>{rarityEnum}</th>)

            index++;
        }
        else{
            //@ts-ignore
            quantityByRarities.push(<td  key={index}>{reportData.quantity.rarity[rarityEnum]}</td>);
            rarityHeaders.push(<th key={index}>{rarityEnum}</th>)
            index++;
        }
        
  
    }

    return (
        <table>
            <thead>
                <tr>
                    {rarityHeaders}
                </tr>
                
            </thead>
            <tbody>
                <tr>
                    {quantityByRarities}
                </tr>
            </tbody>
        </table>
    );

  
}