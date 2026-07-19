import { gql } from "graphql-request"
import { graphqlRequest } from "./client"
import type { DashboardSummary } from "./types"

const DASHBOARD_SUMMARY = gql`
  query DashboardSummary {
    dashboardSummary {
      saldoTotal
      receitasDoMes
      despesasDoMes
    }
  }
`

export function getDashboardSummary() {
    return graphqlRequest<{ dashboardSummary: DashboardSummary }>(DASHBOARD_SUMMARY).then(
        (data) => data.dashboardSummary,
    )
}
