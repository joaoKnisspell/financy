import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { forwardRef, type ChangeEvent } from "react";

interface Props {
    labelText: string;
    inputId: string;
    name?: string;
    value: number;
    onChange: (cents: number) => void;
    onBlur?: () => void;
    description?: string;
    errorMessage?: string;
}

function formatCentsToBRL(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CurrencyInput = forwardRef<HTMLInputElement, Props>(function CurrencyInput(
    { labelText, inputId, name, value, onChange, onBlur, description, errorMessage },
    ref,
) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const digits = event.target.value.replace(/\D/g, "");
        onChange(digits ? parseInt(digits, 10) : 0);
    }

    return (
        <Field className="flex w-full flex-col gap-2" data-invalid={Boolean(errorMessage)}>
            <FieldLabel className="text-gray-700 text-sm font-medium" htmlFor={inputId}>{labelText}</FieldLabel>
            <div className="w-full flex items-center gap-3 border rounded-[8px] h-[48px] px-3 py-1 group-data-[invalid=true]/field:border-destructive">
                <input
                    ref={ref}
                    name={name}
                    id={inputId}
                    inputMode="numeric"
                    className="w-full h-full bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-400"
                    value={formatCentsToBRL(value)}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder="R$ 0,00"
                />
            </div>
            {errorMessage ? (
                <FieldError>{errorMessage}</FieldError>
            ) : (
                description && <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    );
});

export default CurrencyInput;
