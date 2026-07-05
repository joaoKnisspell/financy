import DashboardCardsSection from "@/components/dashboard/dashboard-cards-section/dashboard-cards-section"

const dashboardCardsResponse = {
    saldoTotal: 12847.32,
    receitasDoMes: 4250.00,
    despesasDoMes: 2180.45,
}

export default function Home() {

    return (
        <>
            <DashboardCardsSection cardsData={dashboardCardsResponse} />
        </>
    )
}