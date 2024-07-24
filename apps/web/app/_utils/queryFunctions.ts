import { UserSignUpFormSchema, UserSignInType } from "@repo/typing/user";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { CustomError } from "./error";

export const signUpUser = async ({
	username,
	email,
	password,
}: z.infer<typeof UserSignUpFormSchema>) => {
	try {
		const response = await axios.post(
			"http://localhost:8787/api/v1/user/signup",
			{
				username,
				password,
				email,
			},
			{
				withCredentials: true,
			}
		);

		console.log(response.data);
		return response.status;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response?.data);
			throw new CustomError(
				error.response?.data?.message,
				error.response?.status
			);
		}
	}
};

export const signInUser = async ({ email, password }: UserSignInType) => {
	try {
		const response = await axios.post(
			"http://localhost:8787/api/v1/user/signin",
			{
				email,
				password,
			},
			{
				withCredentials: true,
			}
		);
		console.log(response.data);
		return response.status;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response?.data);
			throw new CustomError(
				error.response?.data?.message,
				error.response?.status
			);
		}
	}
};
