import { FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#64748b",
]

interface Props {
    labelText: string
    value?: string | null
    onChange: (color: string) => void
    description?: string
    errorMessage?: string
}

export default function CategoryColorPicker({ labelText, value, onChange, description, errorMessage }: Props) {
    return (
        <div className="flex w-full flex-col gap-2" data-invalid={Boolean(errorMessage)}>
            <FieldLabel className="text-gray-700 text-sm font-medium">{labelText}</FieldLabel>
            <div className="flex w-full flex-wrap gap-2">
                {CATEGORY_COLORS.map((color) => {
                    const selected = value?.toLowerCase() === color
                    return (
                        <button
                            key={color}
                            type="button"
                            aria-pressed={selected}
                            aria-label={color}
                            onClick={() => onChange(color)}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition-all",
                                selected ? "ring-2 ring-foreground" : "hover:scale-105"
                            )}
                            style={{ backgroundColor: color }}
                        />
                    )
                })}
            </div>
            {errorMessage ? (
                <FieldError>{errorMessage}</FieldError>
            ) : (
                description && <FieldDescription>{description}</FieldDescription>
            )}
        </div>
    )
}
