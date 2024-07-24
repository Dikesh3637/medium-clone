"use client";
import { Button } from "@/components/ui/button";
import { CircleUserRound, SquarePen } from "lucide-react";
import { useUserStore, useSignUpFormStore } from "@/app/_store/store";

export const Navbar = () => {
	const user = useUserStore((state) => state.userId);
	const userName = useUserStore((state) => state.username);
	const toggleSignUp = useSignUpFormStore((state) => state.TogglePopup);
	const setPopUpType = useSignUpFormStore((state) => state.setPopUpType);

	function signInHandler(): void {
		console.log("clicked");
		console.log("username", userName);
	}

	return (
		<div className="home-navbar flex flex-col items-center bg-[#F7F4ED]">
			<div className="logo-div flex items-center justify-between w-full p-[25px] max-w-[1192px]">
				<div className="logo-section">
					<h1 className="font-noe text-[#242424] text-4xl ">Medium</h1>
					<p>{userName}</p>
				</div>
				<div className="button-links flex gap-2 justify-center">
					{user ? (
						<CircleUserRound strokeWidth={0.75} width={32} height={32} />
					) : (
						<Button variant={"rounded"} onClick={signInHandler}>
							sign in
						</Button>
					)}
				</div>
			</div>
			<hr className="w-full border-black" />
		</div>
	);
};
