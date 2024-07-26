"use client";
import { Button } from "@/components/ui/button";
import { CircleUserRound, SquarePen } from "lucide-react";
import { useUserStore, useEditorStore } from "@/app/_store/store";
import { useMutation } from "@tanstack/react-query";
import { publishBlogPost } from "@/app/_utils/queryFunctions";
import { postBlogSchema } from "@repo/typing/blog";
import { z } from "zod";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CustomError } from "@/app/_utils/error";
import { useRouter } from "next/navigation";

export const Navbar = () => {
	const user = useUserStore((state) => state.userId);
	const userName = useUserStore((state) => state.username);
	const document = useEditorStore((state) => state.document) as any;
	const param = useParams<{ blogID: string }>();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof postBlogSchema>) => publishBlogPost(data),
		onSuccess: (data) => {
			if (data === 200) {
				toast.dismiss();
				toast.success("Blog published successfully");
			}
		},
		onError: (error) => {
			toast.dismiss();
			if (error instanceof CustomError) {
				if (error.statusCode === 500) {
					toast.error("Something went wrong!");
				}
			}
		},
	});
	function publishHandler(): void {
		let title = "";
		if (document?.[0]?.content?.[0]?.text) {
			title = document[0].content[0].text;
		}
		const postPayload: z.infer<typeof postBlogSchema> = {
			content: JSON.stringify(document),
			title: title,
			id: param.blogID,
		};

		toast.loading("Publishing...");

		mutation.mutate(postPayload);
	}

	return (
		<div className="home-navbar flex flex-col items-center bg-[#F7F4ED]">
			<div className="logo-div flex items-center justify-between w-full p-[25px] max-w-[1192px]">
				<div className="logo-section flex justify-center items-center gap-2">
					<h1
						className=" font-noe text-[#242424] text-4xl "
						onClick={() => router.push("/read")}
					>
						Medium
					</h1>
					<p className="text-sm">Draft in {userName}</p>
				</div>
				<div className="button-links flex items-center gap-3 justify-center">
					<Button
						onClick={publishHandler}
						className="bg-[#0F730C] "
						variant={"rounded"}
					>
						publish
					</Button>
					{user ? (
						<CircleUserRound strokeWidth={0.75} width={32} height={32} />
					) : (
						<Button variant={"rounded"}>sign in</Button>
					)}
				</div>
			</div>
			<hr className="w-full border-black" />
		</div>
	);
};
