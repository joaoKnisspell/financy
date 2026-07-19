import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import CategoriesAside from "@/components/dashboard/categories-aside/categories-aside"
import DashboardCardsSection from "@/components/dashboard/dashboard-cards-section/dashboard-cards-section"
import RecentTransactionsSection from "@/components/dashboard/recent-transactions-section/recent-transactions-section"
import { getCategories, getCategoriesOverview } from "@/graphql/categories"
import { getDashboardSummary } from "@/graphql/dashboard"
import { getTransactions } from "@/graphql/transactions"

export default function Home() {
    const { data: transactions } = useQuery({
        queryKey: ["transactions", { take: 5 }],
        queryFn: () => getTransactions(undefined, undefined, 5),
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const { data: summary } = useQuery({
        queryKey: ["dashboardSummary"],
        queryFn: getDashboardSummary,
    })

    const { data: overview } = useQuery({
        queryKey: ["categoriesOverview"],
        queryFn: getCategoriesOverview,
    })

    const itemCountByCategoryId = useMemo(() => {
        const countByCategoryId = new Map<string, number>()
        for (const summary of overview?.summaries ?? []) {
            countByCategoryId.set(summary.category.id, summary.itemCount)
        }
        return countByCategoryId
    }, [overview])

    const totalByCategoryId = useMemo(() => {
        const totalsByCategoryId = new Map<string, number>()
        for (const summary of overview?.summaries ?? []) {
            totalsByCategoryId.set(summary.category.id, summary.total)
        }
        return totalsByCategoryId
    }, [overview])

    const dashboardCardsData = {
        saldoTotal: (summary?.saldoTotal ?? 0) / 100,
        receitasDoMes: (summary?.receitasDoMes ?? 0) / 100,
        despesasDoMes: (summary?.despesasDoMes ?? 0) / 100,
    }

    return (
        <div className="flex flex-col gap-6">
            <DashboardCardsSection cardsData={dashboardCardsData} />

            <div className="grid grid-cols-3 gap-6">
                <section className="col-span-2">
                    <RecentTransactionsSection transactions={transactions ?? []} />
                </section>
                <aside>
                    <CategoriesAside
                        categories={categories ?? []}
                        itemCountByCategoryId={itemCountByCategoryId}
                        totalByCategoryId={totalByCategoryId}
                    />
                </aside>
            </div>
        </div>
    )
}
