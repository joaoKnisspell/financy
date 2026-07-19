import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { getErrorCode } from "@/lib/graphql-error"
import { notifyUnauthorized } from "@/lib/auth-storage"

function handlePotentialSessionExpiry(error: unknown) {
    if (getErrorCode(error) === "UNAUTHENTICATED") {
        notifyUnauthorized()
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
    queryCache: new QueryCache({
        onError: handlePotentialSessionExpiry,
    }),
    mutationCache: new MutationCache({
        onError: handlePotentialSessionExpiry,
    }),
})
