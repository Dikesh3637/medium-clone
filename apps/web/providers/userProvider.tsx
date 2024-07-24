"use client";
import { useUserStore } from "@/app/_store/store";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { decodeJwt } from "jose";
import { JWTPayloadType } from "@repo/typing/auth";
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const setUser = useUserStore((state) => state.setUser);
	useEffect(() => {
		const authToken = Cookies.get("token");
		if (authToken) {
			const claims = decodeJwt(authToken);
			const user = {
				username: claims.username,
				email: claims.email,
				id: claims.id,
			};
			setUser(user as JWTPayloadType);
		}
	}, []);
	return <>{children}</>;
};
