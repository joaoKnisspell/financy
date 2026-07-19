import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type PageHeaderProps = {
    title: string
    description: string
    buttonText: string
    onClick: () => void
}

export default function PageHeader({ title, description, buttonText, onClick }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>
            <Button size="sm" onClick={onClick}>
                <Plus size={16} />
                <span className="text-sm font-medium">{buttonText}</span>
            </Button>
        </div>
    )
}