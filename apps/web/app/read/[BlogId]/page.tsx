"use client";

import { SignUpPopup } from "@/app/_components/signupPopup";
import { useUserStore } from "@/app/_store/store";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { JWTPayloadType } from "@repo/typing/auth";
import * as jose from "jose";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/app/_utils/queryFunctions";
import { BlogRender } from "../_components/blogRender";

const ReadPage = () => {
	const setUser = useUserStore((state) => state.setUser);
	const [content, setContent] = useState<string | null>(null);
	const { BlogId } = useParams();

	useEffect(() => {
		getBlogById(BlogId as string).then((data) => {
			console.log("now the blog content is after fetching :", data?.content);
			setContent(data?.content);
		});
	}, []);

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

	return (
		<div>
			<SignUpPopup />
			{content && (
				<div className="py-[25px] w-screen flex justify-center">
					<div className="w-[1192px]">
						<BlogRender includeHeading={true} content={content} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ReadPage;
