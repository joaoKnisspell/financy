import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

import type { Category } from "@/graphql/types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Props {
    categories: Category[]
    itemCountByCategoryId: Map<string, number>
    totalByCategoryId: Map<string, number>
}

function formatCurrency(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function CategoriesAside({ categories, itemCountByCategoryId, totalByCategoryId }: Props) {
    return (
        <Card className="gap-0 rounded-xl py-0">
            <div className="flex h-14 items-center justify-between border-b px-6">
                <span className="text-[12px] font-medium uppercase text-gray-500">Categorias</span>
                <Link
                    to="/categorias"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
                >
                    Gerenciar
                    <ChevronRight className="size-4" />
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    Nenhuma categoria cadastrada ainda.
                </div>
            ) : (
                <div className="flex flex-col gap-5 p-6">
                    {categories.map((category) => {
                        const color = category.color ?? "#64748b"
                        const itemCount = itemCountByCategoryId.get(category.id) ?? 0
                        const total = totalByCategoryId.get(category.id) ?? 0

                        return (
                            <div key={category.id} className="flex items-center justify-between">
                                <Badge style={{ backgroundColor: `${color}1a`, color }}>{category.name}</Badge>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground">
                                        {itemCount} {itemCount === 1 ? "item" : "itens"}
                                    </span>
                                    <span className="text-sm font-semibold">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}
