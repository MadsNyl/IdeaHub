"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useDebounce } from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";

interface SearchInputProps {
	placeholder?: string;
	paramKey?: string;
	debounceMs?: number;
	className?: string;
}

export function SearchInput({
	placeholder = "Search...",
	paramKey = "search",
	debounceMs = 300,
	className,
}: SearchInputProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const initialValue = searchParams.get(paramKey) ?? "";
	const [value, setValue] = React.useState(initialValue);
	const debouncedValue = useDebounce(value, debounceMs);

	React.useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (debouncedValue) {
			params.set(paramKey, debouncedValue);
		} else {
			params.delete(paramKey);
		}

		// Reset to page 1 when search changes
		params.delete("page");

		router.push(`${pathname}?${params.toString()}`);
	}, [debouncedValue, paramKey, pathname, router, searchParams]);

	const handleClear = () => {
		setValue("");
	};

	return (
		<div className={cn("relative", className)}>
			<Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
			<input
				className="h-10 w-full rounded-xl border border-border/50 bg-card/50 pr-9 pl-10 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-border focus:bg-card focus:outline-none"
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				type="text"
				value={value}
			/>
			{value && (
				<button
					className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
					onClick={handleClear}
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
