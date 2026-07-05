interface Props {
    text: string
}

export default function CardValue({ text }: Props) {
    return (
        <span className="font-bold text-[28px]">{text}</span>
    )
}