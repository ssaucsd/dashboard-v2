"use client";

import { useState, useTransition } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { deleteUserProfile } from "@/app/(dashboard)/admin/users/actions";
import posthog from "posthog-js";

interface DeleteUserDialogProps {
    userId: string;
    userName: string;
    userEmail: string;
}

export function DeleteUserDialog({ userId, userName, userEmail }: DeleteUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        setError(null);
        startTransition(async () => {
            const result = await deleteUserProfile(userId);
            if (result.success) {
                setOpen(false);
                // Capture admin user deleted
                posthog.capture('admin_user_deleted', {
                    target_user_id: userId,
                    target_user_name: userName,
                    target_user_email: userEmail,
                });
            } else {
                setError(result.error || 'Failed to delete user');
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                        <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                }
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                        <HugeiconsIcon icon={Alert02Icon} className="h-6 w-6" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{userName}</strong> ({userEmail})? This action cannot be undone and will remove all their data including RSVPs.
                    </AlertDialogDescription>
                    {error && (
                        <p className="text-destructive text-sm">{error}</p>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        variant="destructive"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
