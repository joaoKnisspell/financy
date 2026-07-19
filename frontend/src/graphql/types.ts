export type TransactionType = "INCOME" | "EXPENSE"

export interface User {
    id: string
    name: string
    email: string
    createdAt: string
}

export interface AuthPayload {
    token: string
    user: User
}

export interface Category {
    id: string
    name: string
    description: string | null
    color: string | null
    icon: string | null
    createdAt: string
}

export interface Transaction {
    id: string
    amount: number
    type: TransactionType
    date: string
    description: string
    createdAt: string
    updatedAt: string
    category: Category | null
}

export interface SignUpInput {
    name: string
    email: string
    password: string
}

export interface SignInInput {
    email: string
    password: string
}

export interface UpdateUserInput {
    name: string
}

export interface CreateCategoryInput {
    name: string
    description?: string | null
    color?: string | null
    icon?: string | null
}

export interface UpdateCategoryInput {
    name?: string
    description?: string | null
    color?: string | null
    icon?: string | null
}

export interface CreateTransactionInput {
    amount: number
    type: TransactionType
    date: string
    description: string
    categoryId?: string | null
}

export interface UpdateTransactionInput {
    amount?: number
    type?: TransactionType
    date?: string
    description?: string
    categoryId?: string | null
}

export interface TransactionFilter {
    type?: TransactionType
    categoryId?: string
    startDate?: string
    endDate?: string
}

export interface DashboardSummary {
    saldoTotal: number
    receitasDoMes: number
    despesasDoMes: number
}

export interface CategorySummary {
    category: Category
    itemCount: number
    total: number
}

export interface CategoriesOverview {
    totalCategories: number
    totalTransactions: number
    mostUsedCategory: Category | null
    summaries: CategorySummary[]
}
