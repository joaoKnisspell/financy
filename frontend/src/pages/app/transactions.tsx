import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"
import {
    ArrowDownCircle,
    ArrowUpCircle,
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    SquarePen,
    Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { getCategories } from "@/graphql/categories"
import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
} from "@/graphql/transactions"
import type { Transaction } from "@/graphql/types"
import { getErrorMessage } from "@/lib/graphql-error"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog/confirm-delete-dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CATEGORY_ICONS } from "@/components/shared/category-icon-picker/category-icons"
import CurrencyInput from "@/components/shared/currency-input/currency-input"
import PageHeader from "@/components/shared/page-header/page-header"
import TextInput from "@/components/shared/text-input/text-input"
import TransactionTypeTabs from "@/components/shared/transaction-type-tabs/transaction-type-tabs"

const NO_CATEGORY = "none"
const ALL_TYPES = "ALL"
const ALL_CATEGORIES = "ALL"
const PAGE_SIZE = 10
const MONTH_NAMES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
]

const transactionSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.number().int().positive("O valor deve ser maior que zero"),
    type: z.enum(["INCOME", "EXPENSE"]),
    date: z.string().min(1, "Data é obrigatória"),
    categoryId: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

function formatCurrency(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR")
}

export default function Transactions() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)
    const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES)
    const [periodOpen, setPeriodOpen] = useState(false)
    const [periodMonth, setPeriodMonth] = useState("")
    const [periodYear, setPeriodYear] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const periodFilter =
        periodMonth !== "" && periodYear !== ""
            ? `${periodYear}-${String(Number(periodMonth) + 1).padStart(2, "0")}`
            : ""

    const currentYear = new Date().getFullYear()
    const periodYearOptions = Array.from({ length: 7 }, (_, index) => currentYear + 1 - index)

    const { data: transactions, isLoading } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => getTransactions(),
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const filteredTransactions = (transactions ?? []).filter((transaction) => {
        const matchesSearch =
            search.trim() === "" ||
            transaction.description.toLowerCase().includes(search.trim().toLowerCase())
        const matchesType = typeFilter === ALL_TYPES || transaction.type === typeFilter
        const matchesCategory =
            categoryFilter === ALL_CATEGORIES || transaction.category?.id === categoryFilter
        const matchesPeriod = periodFilter === "" || transaction.date.slice(0, 7) === periodFilter

        return matchesSearch && matchesType && matchesCategory && matchesPeriod
    })

    const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [search, typeFilter, categoryFilter, periodFilter])

    useEffect(() => {
        if (currentPage > pageCount) {
            setCurrentPage(pageCount)
        }
    }, [currentPage, pageCount])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormValues>({ resolver: zodResolver(transactionSchema) })

    function invalidateTransactionQueries() {
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] })
        queryClient.invalidateQueries({ queryKey: ["categoriesOverview"] })
    }

    const createMutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            invalidateTransactionQueries()
            closeDialog()
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateTransaction>[1] }) =>
            updateTransaction(id, input),
        onSuccess: () => {
            invalidateTransactionQueries()
            closeDialog()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            invalidateTransactionQueries()
            setDeletingTransaction(null)
        },
    })

    function openCreateDialog() {
        setEditingTransaction(null)
        setFormError(null)
        reset({
            description: "",
            amount: 0,
            type: "EXPENSE",
            date: new Date().toISOString().slice(0, 10),
            categoryId: NO_CATEGORY,
        })
        setDialogOpen(true)
    }

    function openEditDialog(transaction: Transaction) {
        setEditingTransaction(transaction)
        setFormError(null)
        reset({
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            date: transaction.date.slice(0, 10),
            categoryId: transaction.category?.id ?? NO_CATEGORY,
        })
        setDialogOpen(true)
    }

    function closeDialog() {
        setDialogOpen(false)
        setEditingTransaction(null)
        setFormError(null)
    }

    async function onSubmit(values: TransactionFormValues) {
        setFormError(null)
        const input = {
            description: values.description,
            amount: values.amount,
            type: values.type,
            date: new Date(values.date).toISOString(),
            categoryId: values.categoryId && values.categoryId !== NO_CATEGORY ? values.categoryId : null,
        }
        try {
            if (editingTransaction) {
                await updateMutation.mutateAsync({ id: editingTransaction.id, input })
            } else {
                await createMutation.mutateAsync(input)
            }
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    function handleDelete(transaction: Transaction) {
        setDeletingTransaction(transaction)
    }

    function confirmDelete() {
        if (deletingTransaction) {
            deleteMutation.mutate(deletingTransaction.id)
        }
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <PageHeader title="Transações" description="Gerencie todas as suas transações financeiras" buttonText="Nova transação" onClick={openCreateDialog} />

            <Card className="rounded-xl p-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <TextInput
                    labelText="Buscar"
                    inputId="filter-search"
                    placeholder="Buscar por descrição"
                    icon={Search}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Field className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="filter-type" className="text-gray-700 text-sm font-medium">
                        Tipo
                    </FieldLabel>
                    <Select
                        items={[
                            { value: ALL_TYPES, label: "Todos" },
                            { value: "INCOME", label: "Receita" },
                            { value: "EXPENSE", label: "Despesa" },
                        ]}
                        value={typeFilter}
                        onValueChange={(value) => setTypeFilter(value ?? ALL_TYPES)}
                    >
                        <SelectTrigger id="filter-type" className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_TYPES}>Todos</SelectItem>
                            <SelectItem value="INCOME">Receita</SelectItem>
                            <SelectItem value="EXPENSE">Despesa</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="filter-category" className="text-gray-700 text-sm font-medium">
                        Categoria
                    </FieldLabel>
                    <Select
                        items={[
                            { value: ALL_CATEGORIES, label: "Todos" },
                            ...(categories?.map((category) => ({
                                value: category.id,
                                label: category.name,
                            })) ?? []),
                        ]}
                        value={categoryFilter}
                        onValueChange={(value) => setCategoryFilter(value ?? ALL_CATEGORIES)}
                    >
                        <SelectTrigger id="filter-category" className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_CATEGORIES}>Todos</SelectItem>
                            {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field className="flex w-full flex-col gap-2">
                    <FieldLabel htmlFor="filter-period" className="text-gray-700 text-sm font-medium">
                        Período
                    </FieldLabel>
                    <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
                        <PopoverTrigger
                            render={
                                <Button
                                    id="filter-period"
                                    type="button"
                                    variant="outline"
                                    className="h-[48px] w-full justify-start gap-2 font-normal"
                                />
                            }
                        >
                            <CalendarIcon className="size-4 text-gray-400" />
                            {periodMonth !== "" && periodYear !== "" ? (
                                `${MONTH_NAMES[Number(periodMonth)]} / ${periodYear}`
                            ) : (
                                <span className="text-muted-foreground">Selecione o período</span>
                            )}
                        </PopoverTrigger>
                        <PopoverContent className="flex w-64 flex-col gap-3 p-4">
                            <div className="flex items-center gap-2">
                                <Select value={periodMonth} onValueChange={(value) => setPeriodMonth(value ?? "")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Mês" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTH_NAMES.map((name, index) => (
                                            <SelectItem key={name} value={String(index)}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={periodYear} onValueChange={(value) => setPeriodYear(value ?? "")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodYearOptions.map((year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setPeriodMonth("")
                                    setPeriodYear("")
                                    setPeriodOpen(false)
                                }}
                            >
                                Limpar filtro
                            </Button>
                        </PopoverContent>
                    </Popover>
                </Field>
            </Card>

            <div className="flex w-full flex-col gap-4">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                ) : (
                    <>
                        <div className="w-full overflow-hidden rounded-xl bg-[#FFFFFF] ring-1 ring-foreground/10">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-6 h-[56px] uppercase">Descrição</TableHead>
                                        <TableHead className="px-6 h-[56px] uppercase">Data</TableHead>
                                        <TableHead className="px-6 h-[56px] uppercase">Categoria</TableHead>
                                        <TableHead className="px-6 h-[56px] uppercase">Tipo</TableHead>
                                        <TableHead className="px-6 h-[56px] uppercase">Valor</TableHead>
                                        <TableHead className="px-6 h-[56px] text-right uppercase">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                {transactions?.length === 0
                                                    ? "Nenhuma transação cadastrada ainda."
                                                    : "Nenhuma transação encontrada para os filtros selecionados."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {paginatedTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="px-6 h-[72px] font-medium">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="flex size-10 shrink-0 items-center justify-center rounded-[8px]"
                                                        style={{
                                                            backgroundColor: `${transaction.category?.color ?? "#64748b"}1a`,
                                                            color: transaction.category?.color ?? "#64748b",
                                                        }}
                                                    >
                                                        {(() => {
                                                            const Icon = transaction.category?.icon
                                                                ? CATEGORY_ICONS[transaction.category.icon]
                                                                : undefined
                                                            return Icon ? <Icon size={16} /> : null
                                                        })()}
                                                    </div>
                                                    {transaction.description}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 h-[72px] text-muted-foreground">
                                                {formatDate(transaction.date)}
                                            </TableCell>
                                            <TableCell className="px-6 h-[72px]">
                                                {transaction.category ? (
                                                    <Badge
                                                        style={{
                                                            backgroundColor: `${transaction.category.color ?? "#64748b"}1a`,
                                                            color: transaction.category.color ?? "#64748b",
                                                        }}
                                                    >
                                                        {transaction.category.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Sem categoria</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 h-[72px]">
                                                {transaction.type === "INCOME" ? (
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                                                        <ArrowUpCircle className="size-4" />
                                                        Entrada
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                                                        <ArrowDownCircle className="size-4" />
                                                        Saída
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 h-[72px] font-semibold text-black">
                                                {transaction.type === "INCOME" ? "+ " : "- "}
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell className="px-6 h-[72px] text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon-sm"
                                                        onClick={() => handleDelete(transaction)}
                                                    >
                                                        <Trash2 className="text-red-600" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon-sm"
                                                        onClick={() => openEditDialog(transaction)}
                                                    >
                                                        <SquarePen />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredTransactions.length > 0 && (
                            <Pagination className="justify-end">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationLink
                                            aria-label="Ir para a página anterior"
                                            aria-disabled={currentPage === 1}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                        >
                                            <ChevronLeft />
                                        </PaginationLink>
                                    </PaginationItem>
                                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={page === currentPage}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationLink
                                            aria-label="Ir para a próxima página"
                                            aria-disabled={currentPage === pageCount}
                                            className={currentPage === pageCount ? "pointer-events-none opacity-50" : undefined}
                                            onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                                        >
                                            <ChevronRight />
                                        </PaginationLink>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader
                        title={editingTransaction ? "Editar transação" : "Nova transação"}
                        description="Registre sua despesa ou receita"
                    />
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <TransactionTypeTabs value={field.value} onChange={field.onChange} />
                            )}
                        />
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <TextInput
                                    labelText="Descrição"
                                    inputId="transaction-description"
                                    placeholder="Ex: Almoço no Restaurante"
                                    errorMessage={errors.description?.message}
                                    {...field}
                                />
                            )}
                        />
                        <div className="w-full flex items-center gap-4">
                            <Controller
                                control={control}
                                name="date"
                                render={({ field }) => {
                                    const selectedDate = field.value ? new Date(`${field.value}T00:00:00`) : undefined
                                    return (
                                        <Field className="flex w-full flex-col gap-2" data-invalid={Boolean(errors.date)}>
                                            <FieldLabel className="text-gray-700 text-sm font-medium">Data</FieldLabel>
                                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                <PopoverTrigger
                                                    render={
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-12 w-full justify-start gap-2 font-normal"
                                                        />
                                                    }
                                                >
                                                    <CalendarIcon className="size-4 text-gray-400" />
                                                    {selectedDate ? (
                                                        format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                                                    ) : (
                                                        <span className="text-muted-foreground">Selecione uma data</span>
                                                    )}
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        locale={ptBR}
                                                        selected={selectedDate}
                                                        onSelect={(date) => {
                                                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                                            setCalendarOpen(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.date && <FieldError>{errors.date.message}</FieldError>}
                                        </Field>
                                    )
                                }}
                            />
                            <Controller
                                control={control}
                                name="amount"
                                render={({ field }) => (
                                    <CurrencyInput
                                        labelText="Valor"
                                        inputId="transaction-amount"
                                        value={field.value ?? 0}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        errorMessage={errors.amount?.message}
                                    />
                                )}
                            />
                        </div>
                        <Controller
                            control={control}
                            name="categoryId"
                            render={({ field }) => (
                                <Field className="flex w-full flex-col gap-2">
                                    <FieldLabel htmlFor="transaction-category" className="text-gray-700 text-sm font-medium">
                                        Categoria
                                    </FieldLabel>
                                    <Select
                                        items={[
                                            { value: NO_CATEGORY, label: "Selecione uma categoria" },
                                            ...(categories?.map((category) => ({
                                                value: category.id,
                                                label: category.name,
                                            })) ?? []),
                                        ]}
                                        value={field.value ?? NO_CATEGORY}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="transaction-category" className="w-full">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                        {formError && <p className="text-sm text-destructive">{formError}</p>}
                        <Button size="lg" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={!!deletingTransaction}
                onOpenChange={(open) => !open && setDeletingTransaction(null)}
                title="Excluir transação"
                description={`Tem certeza que deseja excluir a transação "${deletingTransaction?.description}"? Essa ação não pode ser desfeita.`}
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    )
}
