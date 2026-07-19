import { FieldLabel } from "@/components/ui/field"
import { Tabs, TabsIndicator, TabsList, TabsTab } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

export type TransactionTypeValue = "EXPENSE" | "INCOME"

interface Props {
    labelText?: string
    value: TransactionTypeValue
    onChange: (value: TransactionTypeValue) => void
}

export default function TransactionTypeTabs({ labelText, value, onChange }: Props) {

    console.log(value)

    return (
        <div className="flex w-full flex-col gap-2">
            {labelText && <FieldLabel className="text-gray-700 text-sm font-medium">{labelText}</FieldLabel>}
            <Tabs
                value={value}
                onValueChange={(newValue) => onChange(newValue as TransactionTypeValue)}
            >
                <TabsList>
                    <TabsIndicator />
                    <TabsTab value="EXPENSE"><ArrowDownCircle className={cn("mt-0.5", value === "EXPENSE" && "text-red-500")} size={16} />Despesa</TabsTab>
                    <TabsTab value="INCOME"><ArrowUpCircle className={cn(" mt-0.5", value === "INCOME" && "text-green-500")} size={16} />Receita</TabsTab>
                </TabsList>
            </Tabs>
        </div>
    )
}
