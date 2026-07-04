import { Button } from "@/components/ui/button"
import { LogIn, UserRoundPlus } from "lucide-react"

interface Props {
    mode: "login" | "register"
}

const buttonIconStyles = "size-4" as const
const buttonContentStyles = "w-full flex items-center justify-center gap-2" as const

export default function AuthCardFooter({ mode }: Props) {

    const isLogin = mode === "login"

    return (
        <footer className="flex flex-col gap-6">
            <div className="flex items-center justify-center w-full gap-3">
                <div className="flex-1 bg-black/10 h-px" />
                <span className="text-sm">ou</span>
                <div className="flex-1 bg-black/10 h-px" />
            </div>
            <div className="flex flex-col items-center gap-4">
                <span>{isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}</span>
                <Button size="lg" className={buttonContentStyles}>
                    {isLogin ? <UserRoundPlus className={buttonIconStyles} /> : <LogIn className={buttonIconStyles} />}
                    <span>{isLogin ? "Criar Conta" : "Fazer Login"}</span>
                </Button>
            </div>
        </footer>
    )
}