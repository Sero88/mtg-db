import { CardStatsType } from "../../types/searchTypes"
import { StatConditionalEnums } from "../../util/enums/searchConditionals";
import { StatConditions } from "./_statConditions"
import { stats } from "../../util/stats";
import styles from "../../styles/searchStats.module.scss";


type SearchStatsProps = {
    cardStats: CardStatsType
    changeHandler:  (event: React.ChangeEvent<HTMLDivElement>) => void,
}

type StatField = {
    name: string,
    conditional: StatConditionalEnums
    title: string
}


export function SearchStats({cardStats, changeHandler}:SearchStatsProps){
    
    return(
        <div className={styles.statsWrapper}>
        {
        stats.map( (stat, index) => {
            const fieldValue = stat.name in cardStats ? cardStats[stat.name].value : '';
            const conditionValue = stat.name in cardStats ? cardStats[stat.name].conditional : StatConditionalEnums.eq;
            
            return (
                <div onChange={changeHandler} data-name={stat.name} key={index} className={styles.statField}>
                <label className={styles.statLabel}>
                    <span className={styles.statLabelText}>{stat.title}</span>
                    <StatConditions conditionalValue={conditionValue} className={`js-${stat.name}-conditional`}/> 
                    <input type="text" className={`js-${stat.name}-value`} value={fieldValue}/>
                </label>
                </div>
            )
        })
        }
        </div>
    )
}