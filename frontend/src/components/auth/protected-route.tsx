import { useAuth } from "@/hooks/use-auth"
import { Navigate, Outlet } from "react-router"

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return null
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
