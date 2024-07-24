"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSignInFormSchema, UserSignInType } from "@repo/typing/user";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useSignUpFormStore, useUserStore } from "../_store/store";
import { signInUser } from "../_utils/queryFunctions";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CustomError } from "../_utils/error";
import Cookies from "js-cookie";
import * as jose from "jose";
import { JWTPayloadType } from "@repo/typing/auth";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
	const form = useForm<z.infer<typeof UserSignInFormSchema>>({
		resolver: zodResolver(UserSignInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);

	const mutation = useMutation({
		mutationFn: (data: UserSignInType) => signInUser(data),
		onSuccess: (data) => {
			if (data === 200) {
				toast.dismiss();
				toast.success("User signed in successfully");

				const userAuthToken = Cookies.get("authToken");
				const claims = jose.decodeJwt(userAuthToken as string);
				const user = {
					username: claims.username,
					email: claims.email,
					id: claims.id,
				};
				setUser(user as JWTPayloadType);
				TogglePopup();
				router.push("/read");
			}
		},
		onError: (error) => {
			toast.dismiss();
			if (error instanceof CustomError) {
				if (error.statusCode === 404) {
					toast.error("User not found!");
				}
				if (error.statusCode === 401) {
					toast.error("Password is invalid!");
				}
				if (error.statusCode === 500 || error.statusCode === 400) {
					toast.error("Something went wrong!");
				}
			}
		},
	});

	const onSubmitHandler = (data: UserSignInType) => {
		mutation.mutate(data);
		toast.loading("Signing in...");
	};

	const setPopUpType = useSignUpFormStore((state) => state.setPopUpType);
	const TogglePopup = useSignUpFormStore((state) => state.TogglePopup);

	const onClickHandler = () => {
		setPopUpType("sign-up");
	};

	return (
		<>
			<h1 className="text-4xl font-noe">Sign In</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmitHandler)}
					className="space-y-8"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						<Button
							className="rounded-full border-black"
							type="submit"
							variant={"outline"}
						>
							Sign in
						</Button>
						<Button variant={"link"} onClick={onClickHandler}>
							Don't have an account? Sign up here.
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
