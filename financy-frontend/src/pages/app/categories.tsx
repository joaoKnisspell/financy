import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMemo, useState } from "react"

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoriesOverview,
    updateCategory,
} from "@/graphql/categories"
import type { Category, UpdateCategoryInput } from "@/graphql/types"
import { getErrorMessage } from "@/lib/graphql-error"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import PageHeader from "@/components/shared/page-header/page-header"
import TextInput from "@/components/shared/text-input/text-input"
import CategoryColorPicker from "@/components/shared/category-color-picker/category-color-picker"
import CategoryIconPicker from "@/components/shared/category-icon-picker/category-icon-picker"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog/confirm-delete-dialog"
import CategoriesCardsSection from "@/components/categories/categories-cards-section/categories-cards-section"
import CategoryCard from "@/components/categories/category-card/category-card"

const categorySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function Categories() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const { data: overview } = useQuery({
        queryKey: ["categoriesOverview"],
        queryFn: getCategoriesOverview,
    })

    const totalCategories = overview?.totalCategories ?? 0
    const totalTransactions = overview?.totalTransactions ?? 0
    const mostUsedCategory = overview?.mostUsedCategory ?? null

    const itemCountByCategoryId = useMemo(() => {
        const countByCategoryId = new Map<string, number>()
        for (const summary of overview?.summaries ?? []) {
            countByCategoryId.set(summary.category.id, summary.itemCount)
        }
        return countByCategoryId
    }, [overview])

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) })

    function invalidateCategoryQueries() {
        queryClient.invalidateQueries({ queryKey: ["categories"] })
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] })
        queryClient.invalidateQueries({ queryKey: ["categoriesOverview"] })
    }

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            invalidateCategoryQueries()
            closeDialog()
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
            updateCategory(id, input),
        onSuccess: () => {
            invalidateCategoryQueries()
            closeDialog()
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            invalidateCategoryQueries()
            setDeletingCategory(null)
        },
    })

    function openCreateDialog() {
        setEditingCategory(null)
        setFormError(null)
        reset({ name: "", description: "", color: "", icon: "" })
        setDialogOpen(true)
    }

    function openEditDialog(category: Category) {
        setEditingCategory(category)
        setFormError(null)
        reset({
            name: category.name,
            description: category.description ?? "",
            color: category.color ?? "",
            icon: category.icon ?? "",
        })
        setDialogOpen(true)
    }

    function closeDialog() {
        setDialogOpen(false)
        setEditingCategory(null)
        setFormError(null)
    }

    async function onSubmit(values: CategoryFormValues) {
        setFormError(null)
        const input = {
            name: values.name,
            description: values.description || null,
            color: values.color || null,
            icon: values.icon || null,
        }
        try {
            if (editingCategory) {
                await updateMutation.mutateAsync({ id: editingCategory.id, input })
            } else {
                await createMutation.mutateAsync(input)
            }
        } catch (error) {
            setFormError(getErrorMessage(error))
        }
    }

    function handleDelete(category: Category) {
        setDeletingCategory(category)
    }

    function confirmDelete() {
        if (deletingCategory) {
            deleteMutation.mutate(deletingCategory.id)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-12">
            <PageHeader title="Categorias" description="Organize suas transações por categorias" buttonText="Nova categoria" onClick={openCreateDialog} />

            <CategoriesCardsSection
                totalCategories={totalCategories}
                totalTransactions={totalTransactions}
                mostUsedCategory={mostUsedCategory}
            />

            {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {!isLoading && categories?.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>
            )}
            {!isLoading && categories && categories.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            itemCount={itemCountByCategoryId.get(category.id) ?? 0}
                            onEdit={openEditDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader
                        title={editingCategory ? "Editar categoria" : "Nova categoria"}
                        description="Organize suas transações com categorias"
                    />
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextInput
                            labelText="Nome"
                            inputId="category-name"
                            placeholder="Ex: Alimentação"
                            errorMessage={errors.name?.message}
                            {...register("name")}
                        />
                        <TextInput
                            labelText="Descrição (opcional)"
                            inputId="category-description"
                            placeholder="Ex: Descrição da categoria"
                            errorMessage={errors.description?.message}
                            {...register("description")}
                        />
                        <Controller
                            control={control}
                            name="icon"
                            render={({ field }) => (
                                <CategoryIconPicker
                                    labelText="Ícone"
                                    value={field.value}
                                    onChange={field.onChange}
                                    errorMessage={errors.icon?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="color"
                            render={({ field }) => (
                                <CategoryColorPicker
                                    labelText="Cor"
                                    value={field.value}
                                    onChange={field.onChange}
                                    errorMessage={errors.color?.message}
                                />
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
                open={!!deletingCategory}
                onOpenChange={(open) => !open && setDeletingCategory(null)}
                title="Excluir categoria"
                description={`Tem certeza que deseja excluir a categoria "${deletingCategory?.name}"? Essa ação não pode ser desfeita.`}
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    )
}
