"use client";
import { Navbar } from "../_components/navbar";
import { useEffect } from "react";
import { decodeJwt } from "jose";
import { JWTPayloadType } from "@repo/typing/auth";
import Cookies from "js-cookie";
import { useEditorStore, useUserStore } from "../../_store/store";
import Editor from "../_components/editor";
const Write = ({ params }: { params: { blogID: string } }) => {
	const setUser = useUserStore((state) => state.setUser);
	const document = useEditorStore((state) => state.document);
	useEffect(() => {
		const userAuthToken = Cookies.get("authToken");
		if (userAuthToken) {
			const claims = decodeJwt(userAuthToken);
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
			<Navbar></Navbar>
			<div className="flex flex-col items-center">
				<Editor></Editor>
			</div>
		</div>
	);
};

export default Write;
