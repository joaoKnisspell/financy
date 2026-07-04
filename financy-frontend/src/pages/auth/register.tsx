import AuthCardFooter from "@/components/shared/auth-card/auth-card-footer";
import AuthCard from "../../components/shared/auth-card/auth-card";
import AuthLayout from "../../layouts/auth-layout";
import TextInput from "@/components/shared/text-input/text-input";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    return (
        <AuthLayout>
            <AuthCard title="Criar conta" description="Comece a controlar suas finanças ainda hoje">
                <div className="flex flex-col gap-6">
                    <form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <TextInput icon={User} inputId="name" labelText="Nome completo" placeholder="Seu nome completo" />
                            <TextInput icon={Mail} inputId="email" labelText="E-mail" placeholder="mail@exemplo.com" />
                            <TextInput icon={Lock} inputId="password" labelText="Senha" placeholder="Digite sua senha" type="password" description="A senha deve ter no mínimo 8 caracteres" />
                        </div>
                        <Button size="lg" type="submit">Cadastrar</Button>
                    </form>
                    <AuthCardFooter mode="register" />
                </div>
            </AuthCard>
        </AuthLayout>
    )
}