import { StatConditionalEnums } from "../../util/enums/searchConditionals";

type StatConditionProps = {
    conditionalValue: StatConditionalEnums
    className: string
}
export function StatConditions({conditionalValue, className}:StatConditionProps){

    return(
    <select value={conditionalValue} className={className}>
        <option value={StatConditionalEnums.eq}>Equal (=)</option>
        <option value={StatConditionalEnums.ne}>Not Equal (≠)</option>
        <option value={StatConditionalEnums.gt}>Greater Than (&gt;)</option>
        <option value={StatConditionalEnums.gte}>Greater Than or Equal (&gt;=)</option>
        <option value={StatConditionalEnums.lt}>Less Than (&lt;)</option>
        <option value={StatConditionalEnums.lte}>Less Than or Equal (&lt;=)</option>
    </select>
    )
}