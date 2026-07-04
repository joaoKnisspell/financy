import financyLogo from "@/assets/financy-logo.svg"
import { Outlet } from "react-router"

export default function AuthLayout() {
    return (
        <div className="w-screen h-screen flex items-start justify-center pt-12">
            <main className="w-full max-w-[478px] flex flex-col items-center gap-8">
                <img alt="financy logomarca" src={financyLogo} className="w-[134px]" />
                <Outlet />
            </main>
        </div>
    )
}