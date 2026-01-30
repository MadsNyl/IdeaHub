"use server";

import { marked } from "marked";
import { generateIdeaDescription } from "~/lib/openrouter";

export async function generateIdeaDescriptionAction(
	ideaExplanation: string,
	title: string,
): Promise<string> {
	const markdown = await generateIdeaDescription({
		ideaExplanation,
		title,
	});

	// Convert markdown to HTML for the TipTap editor
	const html = marked.parse(markdown);
	return html;
}
