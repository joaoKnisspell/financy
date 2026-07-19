import { Card } from "../../ui/card";
import AuthCardHeader from "./auth-card-header";

interface Props {
    children: React.ReactNode
    title: string
    description: string
}

export default function AuthCard({ children, title, description }: Props) {
    return (
        <Card className="p-8 rounded-xl flex flex-col gap-8 w-full">
            <AuthCardHeader title={title} description={description} />
            {children}
        </Card>
    )
}