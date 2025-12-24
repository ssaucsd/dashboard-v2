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
import { Add01Icon, Edit02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { type Event } from "@/lib/queries";
import { createEvent, updateEvent, type ActionResult } from "@/app/(dashboard)/admin/events/actions";
import { UploadDropzone } from "@/utils/uploadthing";

interface EventFormDialogProps {
    event?: Event;
    trigger?: React.ReactElement;
}

export function EventFormDialog({ event, trigger }: EventFormDialogProps) {
    const isEditing = !!event;
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(event?.image_url || "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('image_url', imageUrl);

        startTransition(async () => {
            let result: ActionResult;
            if (isEditing) {
                result = await updateEvent(event.id, formData);
            } else {
                result = await createEvent(formData);
            }

            if (result.success) {
                setOpen(false);
                if (!isEditing) {
                    setImageUrl("");
                }
            } else {
                setError(result.error || 'An error occurred');
            }
        });
    };

    // Format datetime for input field (convert ISO to datetime-local format)
    const formatDateTimeLocal = (isoString: string | undefined) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen && !isEditing) {
                setImageUrl("");
            }
        }}>
            <DialogTrigger
                render={
                    trigger || (
                        <Button>
                            <HugeiconsIcon icon={Add01Icon} />
                            Add Event
                        </Button>
                    )
                }
            />
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Event" : "Add Event"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the event details below."
                            : "Add a new event for SSA members."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Event title"
                            defaultValue={event?.title || ""}
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Event description"
                            defaultValue={event?.description || ""}
                        />
                        <FieldDescription>Optional description</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="location">Location</FieldLabel>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Event location"
                            defaultValue={event?.location || ""}
                            required
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="start_time">Start Time</FieldLabel>
                            <Input
                                id="start_time"
                                name="start_time"
                                type="datetime-local"
                                defaultValue={formatDateTimeLocal(event?.start_time)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="end_time">End Time</FieldLabel>
                            <Input
                                id="end_time"
                                name="end_time"
                                type="datetime-local"
                                defaultValue={formatDateTimeLocal(event?.end_time)}
                                required
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>Event Image</FieldLabel>
                        {imageUrl ? (
                            <div className="relative">
                                <img
                                    src={imageUrl}
                                    alt="Event preview"
                                    className="w-full h-40 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon-sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setImageUrl("")}
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]?.ufsUrl) {
                                        setImageUrl(res[0].ufsUrl);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    setError(`Upload failed: ${error.message}`);
                                }}
                            />
                        )}
                        <FieldDescription>Upload an image for the event</FieldDescription>
                    </Field>

                    {error && <FieldError>{error}</FieldError>}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add Event"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditEventButton({ event }: { event: Event }) {
    return (
        <EventFormDialog
            event={event}
            trigger={
                <Button variant="ghost" size="icon-sm">
                    <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
                </Button>
            }
        />
    );
}
