import { gql } from "graphql-request"
import { graphqlRequest } from "./client"
import type {
    CreateTransactionInput,
    Transaction,
    TransactionFilter,
    UpdateTransactionInput,
} from "./types"

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    amount
    type
    date
    description
    createdAt
    updatedAt
    category {
      id
      name
      color
      icon
    }
  }
`

const TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  query Transactions($filter: TransactionFilter, $skip: Int, $take: Int) {
    transactions(filter: $filter, skip: $skip, take: $take) {
      ...TransactionFields
    }
  }
`

const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
`

const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
`

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

export function getTransactions(filter?: TransactionFilter, skip?: number, take?: number) {
    return graphqlRequest<{ transactions: Transaction[] }>(TRANSACTIONS, { filter, skip, take }).then(
        (data) => data.transactions,
    )
}

export function createTransaction(input: CreateTransactionInput) {
    return graphqlRequest<{ createTransaction: Transaction }>(CREATE_TRANSACTION, { input }).then(
        (data) => data.createTransaction,
    )
}

export function updateTransaction(id: string, input: UpdateTransactionInput) {
    return graphqlRequest<{ updateTransaction: Transaction }>(UPDATE_TRANSACTION, { id, input }).then(
        (data) => data.updateTransaction,
    )
}

export function deleteTransaction(id: string) {
    return graphqlRequest<{ deleteTransaction: boolean }>(DELETE_TRANSACTION, { id }).then(
        (data) => data.deleteTransaction,
    )
}
