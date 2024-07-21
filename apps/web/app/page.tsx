"use client";
import { Navbar } from "./components/navbar";
import { Button } from "@/components/ui/button";
import { Footer } from "./components/footer";
import Image from "next/image";
import { useRef } from "react";
import { useScreenSize } from "./hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { useSignUpFormStore } from "./store/store";
import { SignUpPopup } from "./components/signupPopup";

const Home = () => {
    const imageRef = useRef<HTMLImageElement>(null)
    const { width, height } = useScreenSize()
    const ImageShift = (width: number) => {
        return width > 1145 ? 0 : -(1145 - width);
    };

    return (
        <div className="home-page navbar" >
            <SignUpPopup />
            <Navbar />
            <div className="homepage-section flex justify-center items-center w-screen h-[calc(100vh-(94px+68px))]">
                <div className="home-content text-[#242424] max-w-[1192px] w-full flex flex-col gap-14 px-[25px]">
                    <div className="font-playfair ">
                        <h1 className="lg:text-8xl md:text-7xl text-6xl font-semibold">Human</h1>
                        <h1 className="lg:text-8xl md:text-7xl text-6xl font-semibold">stories & ideas</h1>
                    </div>
                    <p className="font-inter lg:text-xl md:text-lg text-sm">A place to read, write,and deepen your understanding</p>
                    <Button className="w-min md:bg-black bg-[#156D12] px-6 py-6 font-bold text-base" variant={"rounded"}> Start reading</Button>
                </div>
                <Image
                    ref={imageRef}
                    className={cn("z-[-1] absolute md:block hidden")}
                    style={{ right: `${ImageShift(width)}px` }}
                    src={"/hero-image.webp"}
                    height={500}
                    width={500}
                    alt="hero section image"
                ></Image>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Home;
