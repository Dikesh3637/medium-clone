"use client";
import { useUserStore } from "@/app/_store/store";
import { Navbar } from "./_components/navbar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { JWTPayloadType } from "@repo/typing/auth";
import * as jose from "jose";
import { SignUpPopup } from "../_components/signupPopup";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts } from "../_utils/queryFunctions";
import { CircleUserRound } from "lucide-react";
import { BlogRender } from "./_components/blogRender";
import { useRouter } from "next/navigation";

const Read = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["blogPosts"],
		queryFn: getBlogPosts,
	});
	const user = useUserStore((state) => state.userId);
	const setUser = useUserStore((state) => state.setUser);
	useEffect(() => {
		const userAuthToken = Cookies.get("authToken");
		if (userAuthToken) {
			const claims = jose.decodeJwt(userAuthToken);
			const user = {
				username: claims.username,
				email: claims.email,
				id: claims.id,
			};
			setUser(user as JWTPayloadType);
		}
	}, []);

	const router = useRouter();
	const clickHandler = (id: string) => {
		router.push(`/read/${id}`);
	};
	console.log("now the user is :", user);

	return (
		<div className="read-page">
			{isLoading ? (
				<div>loading articles....</div>
			) : (
				<div className="flex flex-col justify-center items-center gap-2 p-6">
					{data?.map((item) => (
						<button
							onClick={() => clickHandler(item.id)}
							className="text-left article w-[1192px] border-[2px] rounded-lg border-solid border-gray-300 p-[10px] hover:border-black "
							key={item.id}
						>
							<div className="author flex gap-2 items-center font-inter">
								<CircleUserRound strokeWidth={0.75} width={20} height={20} />
								<p>{item.author.name}</p>
							</div>
							<h1 className="text-[2rem] font-inter font-bold">{item.title}</h1>
							<div className="overflow-clip h-[100px]">
								<BlogRender includeHeading={false} content={item.content} />
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default Read;
