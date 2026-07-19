import { ClientError } from "graphql-request"

const MESSAGES_BY_CODE: Record<string, string> = {
    UNAUTHENTICATED: "E-mail ou senha inválidos.",
    CONFLICT: "Este registro já existe.",
    NOT_FOUND: "Registro não encontrado.",
    BAD_REQUEST: "Dados inválidos.",
}

export function getErrorCode(error: unknown): string | undefined {
    if (error instanceof ClientError) {
        return error.response.errors?.[0]?.extensions?.code as string | undefined
    }
    return undefined
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof ClientError) {
        const code = error.response.errors?.[0]?.extensions?.code as string | undefined
        const serverMessage = error.response.errors?.[0]?.message
        return (code && MESSAGES_BY_CODE[code]) ?? serverMessage ?? "Algo deu errado. Tente novamente."
    }
    return "Algo deu errado. Tente novamente."
}
