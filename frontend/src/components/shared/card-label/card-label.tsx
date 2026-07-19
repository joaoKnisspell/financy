import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

interface RootProps extends ComponentProps<'div'> { }

function Root({ ...rest }: RootProps) {
    return (
        <div className="flex items-center justify-center gap-2" {...rest} />
    )
}

interface LabelProps extends ComponentProps<'span'> {
    label: string
}

function Label({ label, className, ...rest }: LabelProps) {
    return (
        <span className={cn("text-xs uppercase font-medium text-gray-500", className)} {...rest}>{label}</span>
    )
}

interface IconProps extends ComponentProps<LucideIcon> {
    icon: LucideIcon
    iconSize?: 'md' | 'lg'
}

function Icon({ icon: Icon, iconSize, className, ...rest }: IconProps) {
    return (
        <Icon size={iconSize === 'md' ? 16 : 20} className={cn("text-gray-500", className)} {...rest} />
    )
}

export const CardLabel = {
    Root,
    Label,
    Icon,
}