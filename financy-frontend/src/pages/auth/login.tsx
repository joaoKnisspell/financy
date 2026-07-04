import AuthCardFooter from "@/components/shared/auth-card/auth-card-footer";
import AuthCard from "../../components/shared/auth-card/auth-card";
import TextInput from "@/components/shared/text-input/text-input";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <AuthCard title="Fazer login" description="Entre na sua conta para continuar">
            <div className="flex flex-col gap-6">
                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <TextInput icon={Mail} inputId="email" labelText="E-mail" placeholder="mail@exemplo.com" />
                        <TextInput icon={Lock} inputId="password" labelText="Senha" placeholder="Digite sua senha" type="password" />
                    </div>
                    <Button size="lg" type="submit">Entrar</Button>
                </form>
                <AuthCardFooter mode="login" />
            </div>
        </AuthCard>
    )
}