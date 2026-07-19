import AuthCardFooter from "@/components/shared/auth-card/auth-card-footer";
import AuthCard from "../../components/shared/auth-card/auth-card";
import TextInput from "@/components/shared/text-input/text-input";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { getErrorMessage } from "@/lib/graphql-error";

const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

    async function onSubmit(values: RegisterFormValues) {
        setFormError(null)
        try {
            await signUp(values)
            navigate("/", { replace: true })
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    return (
        <AuthCard title="Criar conta" description="Comece a controlar suas finanças ainda hoje">
            <div className="flex flex-col gap-6">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex flex-col gap-4">
                        <TextInput
                            icon={User}
                            inputId="name"
                            labelText="Nome completo"
                            placeholder="Seu nome completo"
                            errorMessage={errors.name?.message}
                            {...register("name")}
                        />
                        <TextInput
                            icon={Mail}
                            inputId="email"
                            labelText="E-mail"
                            placeholder="mail@exemplo.com"
                            type="email"
                            errorMessage={errors.email?.message}
                            {...register("email")}
                        />
                        <TextInput
                            icon={Lock}
                            inputId="password"
                            labelText="Senha"
                            placeholder="Digite sua senha"
                            type="password"
                            description="A senha deve ter no mínimo 6 caracteres"
                            errorMessage={errors.password?.message}
                            {...register("password")}
                        />
                    </div>
                    {formError && <p className="text-sm text-destructive">{formError}</p>}
                    <Button size="lg" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </form>
                <AuthCardFooter mode="register" />
            </div>
        </AuthCard>
    )
}
