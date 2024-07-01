import Image from "next/image"
export const Logo = () => {
    return (
        <Image
            src={"/medium.png"}
            height={60}
            width={60}
            alt="Medium Logo"
        >
        </Image>
    )
}
