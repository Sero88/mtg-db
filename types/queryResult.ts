import { ReactElement, ReactNode } from "react"
import { UseQueryResult } from "react-query"

export type QueryResultProps = {
    queryResult: UseQueryResult
    children: ReactElement
}