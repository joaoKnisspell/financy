import { GraphQLError } from "graphql";

export function unauthenticatedError() {
  return new GraphQLError("Usuário não autenticado", {
    extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
  });
}

export function notFoundError(resource = "Recurso") {
  return new GraphQLError(`${resource} não encontrado`, {
    extensions: { code: "NOT_FOUND", http: { status: 404 } },
  });
}

export function badRequestError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: "BAD_REQUEST", http: { status: 400 } },
  });
}

export function conflictError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: "CONFLICT", http: { status: 409 } },
  });
}
