interface Props {
    title: string
    description: string
}

export default function AuthCardHeader({ title, description }: Props) {
    return (
        <div className="flex flex-col gap-1 text-center items-center">
            <h1 className="text-xl font-bold">{title}</h1>
            <span className="text-muted-foreground">{description}</span>
        </div>
    )
}