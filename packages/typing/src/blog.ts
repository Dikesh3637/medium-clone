import { z } from "zod";

export const postBlogSchema = z.object({
	title: z.string(),
	id: z.string(),
	content: z.string(),
});

export const getBlogSchema = z.object({
	title: z.string(),
	content: z.string(),
	isPublished: z.boolean(),
	id: z.string(),
	author: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
	}),
});
