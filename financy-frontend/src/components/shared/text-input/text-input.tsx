import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@base-ui/react";
import type { LucideIcon } from "lucide-react";

interface Props {
    labelText: string;
    inputId: string;
    placeholder?: string
    type?: 'text' | 'password'
    icon?: LucideIcon
    description?: string
}

export default function TextInput({ labelText, inputId, placeholder, type = 'text', icon: Icon, description }: Props) {
    return (
        <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor={inputId}>{labelText}</FieldLabel>
            <div className="w-full flex items-center gap-3 border rounded-md h-12 px-3 py-1">
                {Icon && <Icon className="" size={16} />}
                <Input
                    className="w-full h-full focus:outline-none focus:ring-0"
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                />
            </div>
            {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
    )
}