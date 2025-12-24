"use client";

import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { type Resource } from "@/lib/queries";
import { createResource, updateResource, type ActionResult } from "@/app/(dashboard)/admin/resources/actions";

interface ResourceFormDialogProps {
    resource?: Resource;
    trigger?: React.ReactElement;
}

export function ResourceFormDialog({ resource, trigger }: ResourceFormDialogProps) {
    const isEditing = !!resource;
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            let result: ActionResult;
            if (isEditing) {
                result = await updateResource(resource.id, formData);
            } else {
                result = await createResource(formData);
            }

            if (result.success) {
                setOpen(false);
            } else {
                setError(result.error || 'An error occurred');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    trigger || (
                        <Button>
                            <HugeiconsIcon icon={Add01Icon} />
                            Add Resource
                        </Button>
                    )
                }
            />
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Resource" : "Add Resource"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the resource details below."
                            : "Add a new resource to share with members."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Resource name"
                            defaultValue={resource?.name || ""}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="link">Link URL</FieldLabel>
                        <Input
                            id="link"
                            name="link"
                            type="url"
                            placeholder="https://example.com"
                            defaultValue={resource?.link || ""}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Brief description of the resource"
                            defaultValue={resource?.description || ""}
                        />
                        <FieldDescription>Optional description</FieldDescription>
                    </Field>

                    <Field orientation="horizontal">
                        <input
                            type="checkbox"
                            id="is_pinned"
                            name="is_pinned"
                            defaultChecked={resource?.is_pinned || false}
                            className="h-4 w-4 rounded border-input accent-primary"
                        />
                        <FieldLabel htmlFor="is_pinned" className="cursor-pointer">
                            Pin this resource
                        </FieldLabel>
                    </Field>

                    {error && <FieldError>{error}</FieldError>}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add Resource"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditResourceButton({ resource }: { resource: Resource }) {
    return (
        <ResourceFormDialog
            resource={resource}
            trigger={
                <Button variant="ghost" size="icon-sm">
                    <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
                </Button>
            }
        />
    );
}
