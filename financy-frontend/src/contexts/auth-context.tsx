import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { me as fetchMe, signIn as signInRequest, signUp as signUpRequest, updateUser as updateUserRequest } from "@/graphql/auth"
import type { SignInInput, SignUpInput, UpdateUserInput, User } from "@/graphql/types"
import { clearToken, getToken, setToken, UNAUTHORIZED_EVENT } from "@/lib/auth-storage"

interface AuthContextValue {
    user: User | null
    isLoading: boolean
    signIn: (input: SignInInput) => Promise<void>
    signUp: (input: SignUpInput) => Promise<void>
    signOut: () => void
    updateUser: (input: UpdateUserInput) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const [hasToken, setHasToken] = useState(() => Boolean(getToken()))

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        enabled: hasToken,
        retry: false,
    })

    const signIn = useCallback(
        async (input: SignInInput) => {
            const payload = await signInRequest(input)
            setToken(payload.token)
            queryClient.setQueryData(["me"], payload.user)
            setHasToken(true)
        },
        [queryClient],
    )

    const signUp = useCallback(
        async (input: SignUpInput) => {
            const payload = await signUpRequest(input)
            setToken(payload.token)
            queryClient.setQueryData(["me"], payload.user)
            setHasToken(true)
        },
        [queryClient],
    )

    const updateUser = useCallback(
        async (input: UpdateUserInput) => {
            const updatedUser = await updateUserRequest(input)
            queryClient.setQueryData(["me"], updatedUser)
        },
        [queryClient],
    )

    const signOut = useCallback(() => {
        clearToken()
        setHasToken(false)
        queryClient.setQueryData(["me"], null)
        queryClient.clear()
    }, [queryClient])

    useEffect(() => {
        const handleUnauthorized = () => {
            setHasToken(false)
            queryClient.setQueryData(["me"], null)
        }
        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    }, [queryClient])

    const value = useMemo<AuthContextValue>(
        () => ({
            user: hasToken ? (user ?? null) : null,
            isLoading: hasToken && isLoading,
            signIn,
            signUp,
            signOut,
            updateUser,
        }),
        [hasToken, user, isLoading, signIn, signUp, signOut, updateUser],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
