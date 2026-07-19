import { GraphQLClient } from "graphql-request"
import type { RequestDocument, Variables } from "graphql-request"
import { getToken } from "@/lib/auth-storage"

const endpoint = import.meta.env.VITE_BACKEND_URL as string

const client = new GraphQLClient(endpoint)

export function graphqlRequest<T, V extends Variables = Variables>(
    document: RequestDocument,
    variables?: V,
): Promise<T> {
    const token = getToken()
    return client.request<T>({
        document,
        variables,
        requestHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
}
