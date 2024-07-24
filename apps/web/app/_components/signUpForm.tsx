"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSignUpFormSchema } from "@repo/typing/user";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useSignUpFormStore } from "../_store/store";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../_utils/queryFunctions";
import { toast } from "sonner";
import { CustomError } from "../_utils/error";

export const SignUpForm = () => {
	const form = useForm<z.infer<typeof UserSignUpFormSchema>>({
		resolver: zodResolver(UserSignUpFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof UserSignUpFormSchema>) =>
			signUpUser(data),
		onSuccess: (data) => {
			if (data === 200) {
				toast.success("User signed up successfully");
				toast.dismiss();
				setPopUpType("sign-in");
			}
		},
		onError: (error) => {
			toast.dismiss();
			if (error instanceof CustomError) {
				if (error.statusCode === 409) {
					toast.error("User account already exists!");
				}
				if (error.statusCode === 500) {
					toast.error("Something went wrong!");
				}
			}
		},
	});

	const onSubmit = (data: z.infer<typeof UserSignUpFormSchema>) => {
		mutation.mutate(data);
		toast.loading("signing up...");
	};

	const setPopUpType = useSignUpFormStore((state) => state.setPopUpType);

	const onClickHandler = () => {
		setPopUpType("sign-in");
	};

	return (
		<>
			<h1 className="text-4xl font-noe">Signup -</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
							Sign up
						</Button>
						<Button variant={"link"} onClick={onClickHandler}>
							Already have an account ? sign-in here.
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
