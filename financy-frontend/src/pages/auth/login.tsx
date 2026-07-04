import AuthCardFooter from "@/components/shared/auth-card/auth-card-footer";
import AuthCard from "../../components/shared/auth-card/auth-card";
import AuthLayout from "../../layouts/auth-layout";

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthCard title="Fazer login" description="Entre na sua conta para continuar">
                <div>
                    <AuthCardFooter mode="login" />
                </div>
            </AuthCard>
        </AuthLayout>
    )
}