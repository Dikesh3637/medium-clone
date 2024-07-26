"use client";
import { Button } from "@/components/ui/button";
import { CircleUserRound, SquarePen } from "lucide-react";
import {
	useUserStore,
	useSignUpFormStore,
	useEditorStore,
} from "@/app/_store/store";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
export const Navbar = () => {
	const user = useUserStore((state) => state.userId);
	const toggleSignUp = useSignUpFormStore((state) => state.TogglePopup);
	const setPopUpType = useSignUpFormStore((state) => state.setPopUpType);
	const setDocumentID = useEditorStore((state) => state.setDocumentId);
	const router = useRouter();
	function signInHandler(): void {
		setPopUpType("sign-in");
		toggleSignUp();
	}

	function onClickHandler(): void {
		const blogId = uuidv4();
		setDocumentID(blogId);
		router.push("/write/" + blogId);
	}

	return (
		<div className="home-navbar flex flex-col items-center bg-[#F7F4ED]">
			<div className="logo-div flex items-center justify-between w-full p-[25px] max-w-[1192px]">
				<h1
					className="font-noe text-[#242424] text-4xl "
					onClick={() => router.push("/read")}
				>
					Medium
				</h1>
				<div className="button-links flex gap-2 justify-center">
					{user ? (
						<Button
							className="flex gap-1"
							variant={"link"}
							onClick={onClickHandler}
						>
							<SquarePen strokeWidth={0.75} width={32} height={32} />
							Write
						</Button>
					) : (
						<></>
					)}
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
