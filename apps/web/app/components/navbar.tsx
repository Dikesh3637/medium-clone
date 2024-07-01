import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
    return (
        <div className="home-navbar flex flex-col items-center bg-[#F7F4ED]">
            <div className="logo-div flex items-center justify-between w-full p-[25px] max-w-[1192px]">
                <h1 className="font-noe text-black text-[#242424] text-4xl ">Medium</h1>
                <div className="button-links flex">
                    <Button className="md:block hidden" variant={"link"} size={'lg'}>Sign in</Button>
                    <Button variant={"rounded"}>Get started</Button>
                </div>
            </div >
            <hr className="w-full border-black" />
        </div >
    )
}
