import { FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { CATEGORY_ICON_NAMES, CATEGORY_ICONS } from "./category-icons"

interface Props {
    labelText: string
    value?: string | null
    onChange: (icon: string) => void
    description?: string
    errorMessage?: string
}

export default function CategoryIconPicker({ labelText, value, onChange, description, errorMessage }: Props) {
    return (
        <div className="flex w-full flex-col gap-2" data-invalid={Boolean(errorMessage)}>
            <FieldLabel className="text-gray-700 text-sm font-medium">{labelText}</FieldLabel>
            <div className="grid w-full grid-cols-6 gap-2 sm:grid-cols-8">
                {CATEGORY_ICON_NAMES.map((name) => {
                    const Icon = CATEGORY_ICONS[name]
                    const selected = value === name
                    return (
                        <button
                            key={name}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onChange(name)}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-[8px] border text-gray-500 transition-colors",
                                selected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-transparent bg-muted hover:text-gray-700"
                            )}
                        >
                            <Icon size={18} />
                        </button>
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
