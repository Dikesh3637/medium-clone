"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, Theme, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEditorStore } from "@/app/_store/store";
export default function Editor() {
	const theme = {
		...lightDefaultTheme,
		colors: {
			editor: {
				background: "#F7F4ED",
				text: "#242424",
			},
		},
	} satisfies Theme;

	const editor = useCreateBlockNote({
		initialContent: [
			{
				type: "heading",
				content: "Title",
			},
			{
				type: "paragraph",
				content: "Tell your story...",
			},
		],
	});

	const setDocument = useEditorStore((state) => state.setDocument);

	function onChangeHandler(): void {
		const document = editor.document;
		setDocument(document);
	}

	return (
		<BlockNoteView
			onChange={onChangeHandler}
			theme={theme}
			className="w-[1275px]"
			editor={editor}
		/>
	);
}
