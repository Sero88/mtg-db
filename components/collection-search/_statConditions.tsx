import { StatConditionalEnums } from "../../util/enums/searchConditionals";

type StatConditionProps = {
    conditionalValue: StatConditionalEnums
    className: string
}
export function StatConditions({conditionalValue, className}:StatConditionProps){

    return(
    <select value={conditionalValue} className={className}>
        <option value={StatConditionalEnums.eq}> = (Equal)</option>
        <option value={StatConditionalEnums.ne}> ≠ (Not Equal)</option>
        <option value={StatConditionalEnums.gt}> &gt; (Greater Than)</option>
        <option value={StatConditionalEnums.gte}> &gt;= (Greater Than or Equal)</option>
        <option value={StatConditionalEnums.lt}> &lt; (Less Than)</option>
        <option value={StatConditionalEnums.lte}>&lt;= (Less Than or Equal)</option>
    </select>
    )
}