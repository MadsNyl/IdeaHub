"use client";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import type { NoteType } from "~/schemas/note";

const noteTypeConfig: Record<NoteType, { label: string; className: string }> = {
	RESEARCH: {
		label: "Research",
		className:
			"bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/15",
	},
	MEETING: {
		label: "Meeting",
		className:
			"bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/15",
	},
	FEEDBACK: {
		label: "Feedback",
		className:
			"bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15",
	},
	TASK: {
		label: "Task",
		className:
			"bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/15",
	},
	BRAINSTORM: {
		label: "Brainstorm",
		className:
			"bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15",
	},
	REFERENCE: {
		label: "Reference",
		className:
			"bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/15",
	},
};

interface NoteTypeBadgeProps {
	type: NoteType;
	className?: string;
}

export function NoteTypeBadge({ type, className }: NoteTypeBadgeProps) {
	const config = noteTypeConfig[type];

	return (
		<Badge
			className={cn("font-medium text-xs", config.className, className)}
			variant="outline"
		>
			{config.label}
		</Badge>
	);
}

export { noteTypeConfig };
