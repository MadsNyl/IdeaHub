"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type UpdateProfileInput, updateProfileSchema } from "~/schemas/user";
import { authClient } from "~/server/better-auth/client";

interface ProfileFormProps {
	defaultName: string;
	email: string;
}

export function ProfileForm({ defaultName, email }: ProfileFormProps) {
	const router = useRouter();

	const form = useForm<UpdateProfileInput>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: defaultName,
		},
	});

	const onSubmit = async (data: UpdateProfileInput) => {
		const result = await authClient.updateUser({ name: data.name });

		if (result.error) {
			toast.error(result.error.message ?? "Failed to update profile");
			return;
		}

		toast.success("Profile updated successfully");
		router.refresh();
	};

	return (
		<div className="rounded-2xl border border-border/50 bg-card/50 p-6">
			<h2 className="mb-4 font-semibold text-lg">Profile</h2>

			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-2">
					<label
						className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						htmlFor="name"
					>
						Name
					</label>
					<Input
						className="h-12 border-border/50 bg-card/50 transition-colors focus:border-border focus:bg-card"
						id="name"
						placeholder="Your name"
						{...form.register("name")}
					/>
					{form.formState.errors.name && (
						<p className="text-destructive text-xs">
							{form.formState.errors.name.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						htmlFor="email"
					>
						Email
					</label>
					<Input
						className="h-12 cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground"
						disabled
						id="email"
						value={email}
					/>
					<p className="text-muted-foreground text-xs">
						Email changes require verification and are not supported yet.
					</p>
				</div>

				<div className="pt-2">
					<Button
						className="gap-2"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
						type="submit"
					>
						{form.formState.isSubmitting && (
							<Loader2 className="h-4 w-4 animate-spin" />
						)}
						{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
