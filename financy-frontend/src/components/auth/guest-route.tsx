import { useAuth } from "@/hooks/use-auth"
import { Navigate, Outlet } from "react-router"

export default function GuestRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return null
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
