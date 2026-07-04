import { LogIn, UserRoundPlus } from "lucide-react"
import { Link } from "react-router"

interface Props {
    mode: "login" | "register"
}

const linkIconStyles = "size-4" as const
const linkContentStyles = "w-full flex items-center justify-center gap-2 h-12 bg-transparent border hover:opacity-80 rounded-lg" as const

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
                <Link to={isLogin ? "/register" : "/login"} className={linkContentStyles}>
                    {isLogin ? <UserRoundPlus className={linkIconStyles} /> : <LogIn className={linkIconStyles} />}
                    <span>{isLogin ? "Criar Conta" : "Fazer Login"}</span>
                </Link>
            </div>
        </footer>
    )
}