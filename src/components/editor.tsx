"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Redo,
	Strikethrough,
	Undo,
} from "lucide-react";
import { useEffect } from "react";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export function Editor({
	content,
	onChange,
	placeholder = "Start writing...",
}: EditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		immediatelyRender: false,
		parseOptions: {
			preserveWhitespace: "full",
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-invert max-w-none min-h-[500px] p-4 focus:outline-none",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	// Update editor content when content prop changes
	useEffect(() => {
		if (editor && content && editor.getHTML() !== content) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="rounded-md border border-input bg-background">
			<div className="flex flex-wrap gap-1 border-input border-b p-2">
				<Button
					className={cn(editor.isActive("bold") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleBold().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					className={cn(editor.isActive("italic") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					className={cn(editor.isActive("strike") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Strikethrough className="h-4 w-4" />
				</Button>
				<Button
					className={cn(editor.isActive("bulletList") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					className={cn(editor.isActive("orderedList") && "bg-accent")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					disabled={!editor.can().undo()}
					onClick={() => editor.chain().focus().undo().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					disabled={!editor.can().redo()}
					onClick={() => editor.chain().focus().redo().run()}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Redo className="h-4 w-4" />
				</Button>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}
