import { gql } from "graphql-request"
import { graphqlRequest } from "./client"
import type { AuthPayload, SignInInput, SignUpInput, UpdateUserInput, User } from "./types"

const AUTH_PAYLOAD_FIELDS = gql`
  fragment AuthPayloadFields on AuthPayload {
    token
    user {
      id
      name
      email
      createdAt
    }
  }
`

const SIGN_UP = gql`
  ${AUTH_PAYLOAD_FIELDS}
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ...AuthPayloadFields
    }
  }
`

const SIGN_IN = gql`
  ${AUTH_PAYLOAD_FIELDS}
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      ...AuthPayloadFields
    }
  }
`

const ME = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      createdAt
    }
  }
`

export function signUp(input: SignUpInput) {
    return graphqlRequest<{ signUp: AuthPayload }>(SIGN_UP, { input }).then((data) => data.signUp)
}

export function signIn(input: SignInInput) {
    return graphqlRequest<{ signIn: AuthPayload }>(SIGN_IN, { input }).then((data) => data.signIn)
}

export function me() {
    return graphqlRequest<{ me: User }>(ME).then((data) => data.me)
}

export function updateUser(input: UpdateUserInput) {
    return graphqlRequest<{ updateUser: User }>(UPDATE_USER, { input }).then((data) => data.updateUser)
}
