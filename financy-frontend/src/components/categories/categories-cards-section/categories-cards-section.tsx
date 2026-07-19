import { ArrowUpDown, Tag, Tags, type LucideIcon } from "lucide-react"

import type { Category } from "@/graphql/types"
import { CATEGORY_ICONS } from "@/components/shared/category-icon-picker/category-icons"
import { CardLabel } from "@/components/shared/card-label/card-label"
import CardValue from "@/components/shared/card-value/card-value"
import { Card } from "@/components/ui/card"

interface Props {
    totalCategories: number
    totalTransactions: number
    mostUsedCategory: Category | null
}

const cardRootStyles = "p-6 rounded-xl w-full"
const cardContentRootStyles = "flex gap-4"
const cardTextRootStyles = "flex flex-col gap-2"

export default function CategoriesCardsSection({
    totalCategories,
    totalTransactions,
    mostUsedCategory,
}: Props) {
    const MostUsedIcon: LucideIcon = mostUsedCategory?.icon
        ? CATEGORY_ICONS[mostUsedCategory.icon] ?? Tags
        : Tags

    return (
        <section className="w-full flex gap-6">
            <Card className={cardRootStyles}>
                <div className={cardContentRootStyles}>
                    <Tag size={24} className="text-gray-700" />
                    <div className={cardTextRootStyles}>
                        <CardValue text={String(totalCategories)} />
                        <CardLabel.Label label="Total de categorias" />
                    </div>
                </div>
            </Card>

            <Card className={cardRootStyles}>
                <div className={cardContentRootStyles}>
                    <ArrowUpDown size={24} className="text-[#9333EA]" />
                    <div className={cardTextRootStyles}>
                        <CardValue text={String(totalTransactions)} />
                        <CardLabel.Label label="Total de transações" />
                    </div>
                </div>
            </Card>

            <Card className={cardRootStyles}>
                <div className={cardContentRootStyles}>
                    <MostUsedIcon
                        size={24}
                        style={mostUsedCategory?.color ? { color: mostUsedCategory.color } : undefined}
                        className={mostUsedCategory?.color ? undefined : "text-[#2563EB]"}
                    />
                    <div className={cardTextRootStyles}>
                        <CardValue text={mostUsedCategory?.name ?? "Nenhuma"} />
                        <CardLabel.Label label="Categoria mais utilizada" />
                    </div>
                </div>
            </Card>
        </section>
    )
}
