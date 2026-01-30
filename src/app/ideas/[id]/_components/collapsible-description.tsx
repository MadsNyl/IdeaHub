"use client";

import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";

interface CollapsibleDescriptionProps {
	description: string;
}

export function CollapsibleDescription({
	description,
}: CollapsibleDescriptionProps) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible onOpenChange={setIsOpen} open={isOpen}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-muted-foreground" />
					<h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
						Description
					</h2>
				</div>
				<CollapsibleTrigger asChild>
					<Button className="h-8 gap-1.5 text-xs" size="sm" variant="ghost">
						{isOpen ? (
							<>
								<ChevronUp className="h-3.5 w-3.5" />
								Collapse
							</>
						) : (
							<>
								<ChevronDown className="h-3.5 w-3.5" />
								Expand
							</>
						)}
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent>
				<div className="prose prose-invert mt-4 w-full max-w-none">
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text content from Tiptap editor */}
					<div dangerouslySetInnerHTML={{ __html: description }} />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
