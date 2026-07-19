import { ArrowDownCircle, ArrowUpCircle, ChevronRight, Plus } from "lucide-react"
import { Link } from "react-router"

import type { Transaction } from "@/graphql/types"
import { CATEGORY_ICONS } from "@/components/shared/category-icon-picker/category-icons"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Props {
    transactions: Transaction[]
}

function formatCurrency(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR")
}

export default function RecentTransactionsSection({ transactions }: Props) {
    const recentTransactions = transactions.slice(0, 5)

    return (
        <Card className="gap-0 rounded-xl py-0">
            <div className="flex h-14 items-center justify-between border-b px-6">
                <span className="text-[12px] font-medium uppercase text-gray-500">Transações recentes</span>
                <Link
                    to="/transacoes"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
                >
                    Ver todas
                    <ChevronRight className="size-4" />
                </Link>
            </div>

            {recentTransactions.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    Nenhuma transação cadastrada ainda.
                </div>
            ) : (
                <div>
                    {recentTransactions.map((transaction) => {
                        const Icon = transaction.category?.icon
                            ? CATEGORY_ICONS[transaction.category.icon]
                            : undefined
                        const color = transaction.category?.color ?? "#64748b"

                        return (
                            <div
                                key={transaction.id}
                                className="grid grid-cols-[1fr_140px_140px] items-center border-b px-6 py-4 last:border-0"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center rounded-[8px]"
                                        style={{ backgroundColor: `${color}1a`, color }}
                                    >
                                        {Icon && <Icon size={16} />}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                        <span className="truncate text-base leading-[20px] font-medium">
                                            {transaction.description}
                                        </span>
                                        <span className="text-[14px] font-normal text-gray-600">
                                            {formatDate(transaction.date)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    {transaction.category ? (
                                        <Badge style={{ backgroundColor: `${color}1a`, color }}>
                                            {transaction.category.name}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Sem categoria</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-1.5 text-base font-semibold text-black">
                                    <span className="text-sm font-semibold">{formatCurrency(transaction.amount)}</span>
                                    {transaction.type === "INCOME" ? (
                                        <ArrowUpCircle className="size-4 text-emerald-600" />
                                    ) : (
                                        <ArrowDownCircle className="size-4 text-red-600" />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <Link
                to="/transacoes"
                className="flex h-14 items-center justify-center gap-1.5 border-t text-sm font-medium text-primary hover:opacity-80"
            >
                <Plus className="size-4" />
                Nova Transação
            </Link>
        </Card>
    )
}
