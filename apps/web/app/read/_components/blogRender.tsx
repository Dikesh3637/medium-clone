"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Block } from "@blocknote/core";

export const BlogRender = ({
	content,
	includeHeading,
}: {
	content: string;
	includeHeading?: boolean;
}) => {
	const theme = {
		...lightDefaultTheme,
		colors: {
			editor: {
				background: "#F7F4ED",
				text: "#242424",
			},
		},
	} satisfies Theme;
	const parsedData: Block[] = JSON.parse(content);
	let data = parsedData;
	if (includeHeading === false) {
		data = parsedData.slice(1);
	}
	const editor = useCreateBlockNote({ initialContent: data });
	console.log("now the content received is :", content);
	console.log("now the date to be rendered is :", data);

	return (
		<BlockNoteView
			theme={theme}
			editor={editor}
			editable={false}
		></BlockNoteView>
	);
};
