import AuthCardFooter from "@/components/shared/auth-card/auth-card-footer";
import AuthCard from "../../components/shared/auth-card/auth-card";
import TextInput from "@/components/shared/text-input/text-input";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { getErrorMessage } from "@/lib/graphql-error";

const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

    async function onSubmit(values: LoginFormValues) {
        setFormError(null)
        try {
            await signIn(values)
            navigate("/", { replace: true })
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    return (
        <AuthCard title="Fazer login" description="Entre na sua conta para continuar">
            <div className="flex flex-col gap-6">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex flex-col gap-4">
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
                            errorMessage={errors.password?.message}
                            {...register("password")}
                        />
                    </div>
                    {formError && <p className="text-sm text-destructive">{formError}</p>}
                    <Button size="lg" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
                <AuthCardFooter mode="login" />
            </div>
        </AuthCard>
    )
}
