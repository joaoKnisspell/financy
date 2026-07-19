import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TextInput from "@/components/shared/text-input/text-input"
import { useAuth } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router"
import { useState } from "react"
import { getErrorMessage } from "@/lib/graphql-error"
import { getInitials } from "@/lib/utils"

const profileSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
    const { user, updateUser, signOut } = useAuth()
    const navigate = useNavigate()
    const [formError, setFormError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user?.name ?? "" },
    })

    async function onSubmit(values: ProfileFormValues) {
        setFormError(null)
        setSuccessMessage(null)
        try {
            await updateUser({ name: values.name })
            setSuccessMessage("Alterações salvas com sucesso")
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    function handleLogout() {
        signOut()
        navigate("/login", { replace: true })
    }

    if (!user) return null

    return (
        <div className="flex flex-col pb-12">
            <Card className="p-8 rounded-xl flex flex-col gap-8 w-full max-w-[478px] mx-auto">
                <div className="flex flex-col gap-1 items-center">
                    <div className="size-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-lg font-medium">{getInitials(user.name)}</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mt-3">{user.name}</h1>
                    <span className="text-gray-600">{user.email}</span>
                </div>

                <div className="h-px bg-black/10 w-full" />

                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex flex-col gap-4">
                        <TextInput
                            inputId="name"
                            labelText="Nome completo"
                            placeholder="Digite seu nome completo"
                            errorMessage={errors.name?.message}
                            {...register("name")}
                        />
                        <TextInput
                            inputId="email"
                            labelText="E-mail"
                            type="email"
                            description="O e-mail não pode ser alterado"
                            disabled
                            defaultValue={user.email}
                        />
                    </div>
                    {formError && <p className="text-sm text-destructive">{formError}</p>}
                    {successMessage && <p className="text-sm text-primary">{successMessage}</p>}
                    <div className="flex flex-col gap-3">
                        <Button size="lg" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar alterações"}
                        </Button>
                        <Button size="lg" type="button" variant="outline" onClick={handleLogout}>
                            Sair da conta
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
