"use client";
import { UserProvider } from "@/providers/userProvider";
import { Navbar } from "./_components/navbar";
import { useEffect } from "react";
import { decodeJwt } from "jose";
import { JWTPayloadType } from "@repo/typing/auth";
import Cookies from "js-cookie";
import { useUserStore } from "../_store/store";
const Write = () => {
	const setUser = useUserStore((state) => state.setUser);

	return (
		<div>
			<Navbar></Navbar>
			<h1>Write</h1>
		</div>
	);
};

export default Write;
