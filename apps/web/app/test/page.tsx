"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../_store/store";
import { useRouter } from "next/navigation";

const Test = () => {
	const userName = useUserStore((state) => state.username);
	const userEmail = useUserStore((state) => state.email);
	const userId = useUserStore((state) => state.userId);
	const setUserName = useUserStore((state) => state.setUsername);
	const setUserEmail = useUserStore((state) => state.setEmail);
	const setUserId = useUserStore((state) => state.setUserId);
	const router = useRouter();

	console.log("now the user name is :", userName);
	console.log("now the user email is :", userEmail);
	console.log("now the user id is :", userId);

	const clickHandler1 = () => {
		setUserName("Dikesh");
	};

	const clickHandler2 = () => {
		setUserEmail("Dikesh@gmail.com");
	};

	const clickHandler3 = () => {
		setUserId("askdfal;ksdjfl;ajs");
	};

	return (
		<div>
			<Button onClick={clickHandler1}>set userName</Button>
			<Button onClick={clickHandler2}>set email</Button>
			<Button onClick={clickHandler3}>set Id</Button>
			<Button onClick={() => router.push("/test/test1")}>go to test 1</Button>
		</div>
	);
};

export default Test;
