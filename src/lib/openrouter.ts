import { env } from "~/env";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Using a cheap reasoning model: DeepSeek-R1 Lite is cost-effective and good for reasoning
const MODEL = "deepseek/deepseek-r1-distill-llama-70b";

const ENTREPRENEURIAL_SYSTEM_PROMPT = `You are an expert at helping entrepreneurs structure and clearly explain their ideas. Your role is to take raw, unstructured ideas and organize them into clear, professional descriptions.

When given an idea, you will:

1. **Clarify and Structure**: Organize the idea into a coherent concept
2. **Identify Key Elements**: Extract and present the core problem, proposed solution, target market, and value proposition
3. **Refine the Narrative**: Present the idea in a clear, professional manner

Respond with well-structured markdown that includes:
- A concise one-line description at the top
- Problem: What challenge does this address?
- Solution: How does the idea solve this problem?
- Target Market: Who are the primary users?
- Value Proposition: What value does it provide?

Keep the tone objective and straightforward. Do NOT include strategic analysis, assumptions to validate, potential challenges, opportunities, business models, or judgments about whether the idea is good. Simply describe what the idea is.`;

interface GenerateDescriptionOptions {
	ideaExplanation: string;
	title: string;
}

export async function generateIdeaDescription(
	options: GenerateDescriptionOptions,
): Promise<string> {
	if (!env.OPENROUTER_API_KEY) {
		throw new Error("OPENROUTER_API_KEY is not configured");
	}

	const userMessage = `Here's my startup idea:

**Title**: ${options.title}

**My explanation**: ${options.ideaExplanation}

Please help me refine this into a well-structured business idea description with strategic insights.`;

	const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
			"HTTP-Referer": "https://ideahub.local",
			"X-Title": "IdeaHub",
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{
					role: "system",
					content: ENTREPRENEURIAL_SYSTEM_PROMPT,
				},
				{
					role: "user",
					content: userMessage,
				},
			],
			temperature: 0.7,
			max_tokens: 2000,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(
			`OpenRouter API error: ${error.error?.message || "Unknown error"}`,
		);
	}

	const data = (await response.json()) as {
		choices: Array<{ message: { content: string } }>;
	};
	const content = data.choices[0]?.message.content;

	if (!content) {
		throw new Error("No content in OpenRouter response");
	}

	return content;
}
