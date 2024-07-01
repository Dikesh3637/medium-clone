import { Navbar } from "./components/navbar";
import { Button } from "@/components/ui/button";
import { Footer } from "./components/footer";
const Home = () => {
    return (

        <div className="home-page navbar" >
            <Navbar />
            <div className="homepage-section flex justify-center items-center w-screen h-[calc(100vh-(94px+68px))]">
                <div className="home-content text-[#242424] max-w-[1192px] w-full flex flex-col gap-14 px-[25px]">
                    <div className="font-playfair ">
                        <h1 className="text-8xl font-semibold">Human</h1>
                        <h1 className="text-8xl font-semibold">stories & ideas</h1>
                    </div>
                    <p className="font-inter text-xl">A place to read, write,and deepen your understanding</p>
                    <Button className="w-min px-6 py-6 font-bold text-base" variant={"rounded"}> Start reading</Button>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Home;
