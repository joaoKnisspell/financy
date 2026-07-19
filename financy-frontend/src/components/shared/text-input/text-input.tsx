import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@base-ui/react";
import type { LucideIcon } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

interface Props extends Omit<ComponentPropsWithoutRef<typeof Input>, "id" | "type"> {
    labelText: string;
    inputId: string;
    placeholder?: string
    type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'month'
    icon?: LucideIcon
    description?: string
    errorMessage?: string
}

const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
    { labelText, inputId, placeholder, type = 'text', icon: Icon, description, errorMessage, ...rest },
    ref,
) {
    return (
        <Field className="flex w-full flex-col gap-2" data-invalid={Boolean(errorMessage)}>
            <FieldLabel className="text-gray-700 text-sm font-medium" htmlFor={inputId}>{labelText}</FieldLabel>
            <div className="w-full flex items-center gap-3 border rounded-[8px] h-[48px] px-3 py-1 group-data-[invalid=true]/field:border-destructive">
                {Icon && <Icon className="text-gray-400" size={16} />}
                <Input
                    ref={ref}
                    className="w-full h-full focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    {...rest}
                />
            </div>
            {errorMessage ? (
                <FieldError>{errorMessage}</FieldError>
            ) : (
                description && <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    )
})

export default TextInput
