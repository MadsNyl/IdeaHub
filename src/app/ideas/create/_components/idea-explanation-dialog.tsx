"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { generateIdeaDescriptionAction } from "./actions";

interface IdeaExplanationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	onDescriptionGenerated: (description: string) => void;
}

export function IdeaExplanationDialog({
	open,
	onOpenChange,
	title,
	onDescriptionGenerated,
}: IdeaExplanationDialogProps) {
	const [explanation, setExplanation] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleGenerate = async () => {
		if (!explanation.trim()) {
			toast.error("Please explain your idea");
			return;
		}

		setIsLoading(true);
		try {
			const description = await generateIdeaDescriptionAction(
				explanation,
				title,
			);

			onDescriptionGenerated(description);
			setExplanation("");
			onOpenChange(false);
			toast.success("Description generated successfully!");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to generate description";
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>AI Description Generator</DialogTitle>
					<DialogDescription>
						Explain your startup idea in your own words. Our AI will help
						structure it into a compelling business description.
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="flex flex-col items-center justify-center gap-5 py-12">
						<div className="relative">
							<div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 blur-xl" />
							<div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
								<Loader2 className="h-7 w-7 animate-spin text-primary" />
							</div>
						</div>
						<div className="text-center">
							<p className="font-medium text-sm">Generating description</p>
							<p className="mt-1 text-muted-foreground/60 text-xs">
								Analyzing your idea...
							</p>
						</div>
						<div className="flex gap-1.5">
							<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40" />
							<div
								className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40"
								style={{ animationDelay: "0.15s" }}
							/>
							<div
								className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40"
								style={{ animationDelay: "0.3s" }}
							/>
						</div>
					</div>
				) : (
					<>
						<div className="py-2">
							<Textarea
								className="min-h-[160px] resize-none border-border/50 bg-card/50 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-border focus:bg-card"
								disabled={isLoading}
								onChange={(e) => setExplanation(e.target.value)}
								placeholder="E.g., I want to build a tool that helps freelancers find projects... I think there's a gap in the market because..."
								value={explanation}
							/>
						</div>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								type="button"
								variant="ghost"
							>
								Cancel
							</Button>
							<Button
								className="gap-2"
								disabled={isLoading || !explanation.trim()}
								onClick={handleGenerate}
								type="button"
							>
								<Sparkles className="h-4 w-4" />
								Generate
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
