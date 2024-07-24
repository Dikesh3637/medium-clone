"use client";
import { Navbar } from "./_components/navbar";
import { Button } from "@/components/ui/button";
import { Footer } from "./_components/footer";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useScreenSize } from "./_hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { SignUpPopup } from "./_components/signupPopup";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import * as jose from "jose";
import { useUserStore } from "./_store/store";
import { JWTPayloadType } from "@repo/typing/auth";

const Home = () => {
	const authToken = Cookies.get("authToken");
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (authToken) {
			const claims = jose.decodeJwt(authToken);
			const user = {
				username: claims.username,
				email: claims.email,
				id: claims.id,
			};
			setUser(user as JWTPayloadType);
			setRedirect(true);
		}
	}, [authToken]);

	useEffect(() => {
		if (redirect) {
			router.push("/read");
		}
	}, [redirect]);

	const imageRef = useRef<HTMLImageElement>(null);
	const { width } = useScreenSize();
	const ImageShift = (width: number) => {
		return width > 1145 ? 0 : -(1145 - width);
	};

	return (
		<div className="home-page navbar">
			<SignUpPopup />
			<Navbar />
			<div className="homepage-section flex justify-center items-center w-screen h-[calc(100vh-(94px+68px))]">
				<div className="home-content text-[#242424] max-w-[1192px] w-full flex flex-col gap-14 px-[25px]">
					<div className="font-playfair">
						<h1 className="lg:text-8xl md:text-7xl text-6xl font-semibold">
							Human
						</h1>
						<h1 className="lg:text-8xl md:text-7xl text-6xl font-semibold">
							stories & ideas
						</h1>
					</div>
					<p className="font-inter lg:text-xl md:text-lg text-sm">
						A place to read, write, and deepen your understanding
					</p>
					<Button
						className="w-min md:bg-black bg-[#156D12] px-6 py-6 font-bold text-base"
						variant={"rounded"}
						onClick={() => router.push("/read")}
					>
						Start reading
					</Button>
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
			<Footer />
		</div>
	);
};

export default Home;
