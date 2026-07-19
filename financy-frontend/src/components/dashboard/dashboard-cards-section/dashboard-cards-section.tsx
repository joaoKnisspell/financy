import { CardLabel } from "@/components/shared/card-label/card-label";
import CardValue from "@/components/shared/card-value/card-value";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface Props {
    cardsData: {
        saldoTotal: number,
        receitasDoMes: number,
        despesasDoMes: number,
    }
}

type CardKey = keyof Props["cardsData"]

const icons: Record<CardKey, typeof Wallet> = {
    despesasDoMes: Wallet,
    receitasDoMes: Wallet,
    saldoTotal: Wallet,
}

const labels: Record<CardKey, string> = {
    despesasDoMes: 'Depesas do Mês',
    receitasDoMes: 'Receitas do Mês',
    saldoTotal: 'Saldo Total',
}

export default function DashboardCardsSection({ cardsData }: Props) {

    return (
        <section className="w-full flex justify-center items-center gap-6">
            {(Object.entries(cardsData) as [CardKey, number][]).map(([key, value]) => (
                <Card key={key} className="p-6 rounded-xl items-start flex flex-col w-full gap-4">
                    <CardLabel.Root>
                        <CardLabel.Icon data-label={key} icon={icons[key]} className="data-[label='despesasDoMes']:text-red-500 data-[label='receitasDoMes']:text-green-500 data-[label='saldoTotal']:text-blue-500" />
                        <CardLabel.Label label={labels[key]} />
                    </CardLabel.Root>
                    <CardValue text={value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </Card>
            ))}
        </section>
    )
}