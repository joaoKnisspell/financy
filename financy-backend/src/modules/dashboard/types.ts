import { builder } from "../../builder.js";

export interface DashboardSummaryShape {
  saldoTotal: number;
  receitasDoMes: number;
  despesasDoMes: number;
}

export const DashboardSummaryType = builder
  .objectRef<DashboardSummaryShape>("DashboardSummary")
  .implement({
    fields: (t) => ({
      saldoTotal: t.exposeInt("saldoTotal"),
      receitasDoMes: t.exposeInt("receitasDoMes"),
      despesasDoMes: t.exposeInt("despesasDoMes"),
    }),
  });
