"use client";
import { useUserStore } from "@/app/_store/store";
const TestOne = () => {
	const userId = useUserStore((state) => state.userId);
	const userName = useUserStore((state) => state.username);
	const userEmail = useUserStore((state) => state.email);

	console.log("now  on test1 the user name is :", userName);
	console.log("now on test1 the user email is :", userEmail);
	console.log("now on test1 the user id is :", userId);

	return (
		<div>
			<h1>test1</h1>
		</div>
	);
};

export default TestOne;
