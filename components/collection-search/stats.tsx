import { CardStatsType } from "../../types/searchTypes"
import { StatConditionalEnums } from "../../util/enums/searchConditionals";
import { StatConditions } from "./_statConditions"


type SearchStatsProps = {
    cardStats: CardStatsType
    changeHandler:  (event: React.ChangeEvent<HTMLDivElement>) => void,
}

type StatField = {
    name: string,
    conditional: StatConditionalEnums
    title: string
}

const stats = [
    {name:"manaValue", title:"Mana Value"},
    {name:"power", title:"Power"},
    {name:"toughness", title:"Toughness"},
    {name:"loyalty",  title:"Loyalty"},
];

export function SearchStats({cardStats, changeHandler}:SearchStatsProps){
    
    return(
        <>
        {
        stats.map( (stat, index) => {
            const fieldValue = stat.name in cardStats ? cardStats[stat.name].value : '';
            const conditionValue = stat.name in cardStats ? cardStats[stat.name].conditional : StatConditionalEnums.eq;
            
            return (
                <div onChange={changeHandler} data-name={stat.name} key={index}>
                <label>
                    {stat.title}
                    <StatConditions conditionalValue={conditionValue} className={`js-${stat.name}-conditional`}/> 
                    <input type="text" className={`js-${stat.name}-value`} value={fieldValue}/>
                </label>
                </div>
            )
        })
        }
        </>
    )
}