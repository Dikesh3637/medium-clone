"use client";
import { useUserStore } from "@/app/_store/store";
import { Navbar } from "./_components/navbar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { JWTPayloadType } from "@repo/typing/auth";
import * as jose from "jose";
import { SignUpPopup } from "../_components/signupPopup";

const Read = () => {
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
	console.log("now the user is :", user);

	return (
		<div className="read-page">
			<SignUpPopup />
			<Navbar />
		</div>
	);
};

export default Read;
