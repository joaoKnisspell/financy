import { SquarePen, Trash2 } from "lucide-react"

import type { Category } from "@/graphql/types"
import { CATEGORY_ICONS } from "@/components/shared/category-icon-picker/category-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
    category: Category
    itemCount: number
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export default function CategoryCard({ category, itemCount, onEdit, onDelete }: Props) {
    const Icon = category.icon ? CATEGORY_ICONS[category.icon] : undefined
    const color = category.color ?? "#64748b"

    return (
        <Card className="flex flex-col gap-4 rounded-xl px-6 py-5">
            <div className="flex items-start justify-between">
                <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-[8px]"
                    style={{ backgroundColor: `${color}1a`, color }}
                >
                    {Icon && <Icon size={16} />}
                </span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon-sm" onClick={() => onDelete(category)}>
                        <Trash2 className="text-red-600" />
                    </Button>
                    <Button variant="outline" size="icon-sm" onClick={() => onEdit(category)}>
                        <SquarePen />
                    </Button>
                </div>
            </div>
            <div className="flex h-[68px] w-full flex-col gap-1">
                <span className="text-base font-semibold leading-5">{category.name}</span>
                {category.description && (
                    <span className="line-clamp-2 text-sm text-gray-600">{category.description}</span>
                )}
            </div>
            <div className="mt-auto flex items-center justify-between">
                <Badge style={{ backgroundColor: `${color}1a`, color }}>{category.name}</Badge>
                <span className="text-sm text-muted-foreground">{itemCount} itens</span>
            </div>
        </Card>
    )
}
