import { UserSignUpFormSchema, UserSignInType } from "@repo/typing/user";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { CustomError } from "./error";
import { getBlogSchema, postBlogSchema } from "@repo/typing/blog";

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
		throw error;
	}
};

export const publishBlogPost = async ({
	content,
	id,
	title,
}: z.infer<typeof postBlogSchema>) => {
	try {
		const response = await axios.post(
			`http://localhost:8787/api/v1/blog/${id}`,
			{
				content,
				id,
				title,
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
		throw error;
	}
};

export const getBlogPosts = async (): Promise<
	z.infer<typeof getBlogSchema>[]
> => {
	try {
		const response = await axios.get("http://localhost:8787/api/v1/blog", {
			withCredentials: true,
		});
		console.log("response data from get post ", response.data);
		return response.data.posts;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response?.data);
			throw new CustomError(
				error.response?.data?.message,
				error.response?.status
			);
		}
		throw error;
	}
};

export const getBlogById = async (
	id: string
): Promise<z.infer<typeof getBlogSchema>> => {
	try {
		const response = await axios.get(
			`http://localhost:8787/api/v1/blog/${id}`,
			{
				withCredentials: true,
			}
		);
		console.log("response data from get post by id", response.data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error.response?.data);
			throw new CustomError(
				error.response?.data?.message,
				error.response?.status
			);
		}
		throw error;
	}
};
