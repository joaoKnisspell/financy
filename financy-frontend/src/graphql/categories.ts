import { gql } from "graphql-request"
import { graphqlRequest } from "./client"
import type { CategoriesOverview, Category, CreateCategoryInput, UpdateCategoryInput } from "./types"

const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    description
    color
    icon
    createdAt
  }
`

const CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`

const CATEGORIES_OVERVIEW = gql`
  ${CATEGORY_FIELDS}
  query CategoriesOverview {
    categoriesOverview {
      totalCategories
      totalTransactions
      mostUsedCategory {
        ...CategoryFields
      }
      summaries {
        itemCount
        total
        category {
          ...CategoryFields
        }
      }
    }
  }
`

const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
`

const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
`

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`

export function getCategories() {
    return graphqlRequest<{ categories: Category[] }>(CATEGORIES).then((data) => data.categories)
}

export function getCategoriesOverview() {
    return graphqlRequest<{ categoriesOverview: CategoriesOverview }>(CATEGORIES_OVERVIEW).then(
        (data) => data.categoriesOverview,
    )
}

export function createCategory(input: CreateCategoryInput) {
    return graphqlRequest<{ createCategory: Category }>(CREATE_CATEGORY, { input }).then(
        (data) => data.createCategory,
    )
}

export function updateCategory(id: string, input: UpdateCategoryInput) {
    return graphqlRequest<{ updateCategory: Category }>(UPDATE_CATEGORY, { id, input }).then(
        (data) => data.updateCategory,
    )
}

export function deleteCategory(id: string) {
    return graphqlRequest<{ deleteCategory: boolean }>(DELETE_CATEGORY, { id }).then(
        (data) => data.deleteCategory,
    )
}
