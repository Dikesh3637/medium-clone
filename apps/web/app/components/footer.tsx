import { Copyright } from "lucide-react"

export const Footer = () => {
    return (
        <div className="footer w-screen bottom-0 bg-[#F7F4ED] hidden md:block absolute">
            <hr className="w-full border-black" />
            <div className="flex gap-1 items-center justify-center w-full h-[64px]">
                <Copyright className="h-4 w-4 text-muted-foreground"></Copyright>
                <div className="text-sm text-muted-foreground">This is a Medium Clone made with nextjs and typescript</div>
            </div>
        </div>
    )
}
