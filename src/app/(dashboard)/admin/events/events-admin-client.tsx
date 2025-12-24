"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type Event } from "@/lib/queries";
import { EventFormDialog, EditEventButton } from "@/components/EventFormDialog";
import { DeleteEventDialog } from "@/components/DeleteEventDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon, Clock01Icon } from "@hugeicons/core-free-icons";

interface EventsAdminClientProps {
    events: Event[];
}

function formatEventDate(startTime: string, endTime: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
    };

    const dateStr = start.toLocaleDateString('en-US', dateOptions);
    const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
    const endTimeStr = end.toLocaleTimeString('en-US', timeOptions);

    return {
        date: dateStr,
        time: `${startTimeStr} - ${endTimeStr}`,
    };
}

export function EventsAdminClient({ events }: EventsAdminClientProps) {
    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">
                        {events.length} event{events.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <EventFormDialog />
            </div>

            {/* Events List */}
            {events.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted p-4">
                            <HugeiconsIcon icon={Calendar03Icon} className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No events yet</h3>
                            <p className="text-muted-foreground">
                                Add your first event to get started.
                            </p>
                        </div>
                        <EventFormDialog />
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => {
                        const { date, time } = formatEventDate(event.start_time, event.end_time);
                        return (
                            <Card key={event.id} className="p-0 overflow-hidden">
                                {/* Event Image */}
                                {event.image_url && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Title and Actions */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-lg line-clamp-1">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <EditEventButton event={event} />
                                                <DeleteEventDialog
                                                    eventId={event.id}
                                                    eventTitle={event.title}
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {event.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}

                                        {/* Event Details */}
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4 shrink-0" />
                                                <span>{date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 shrink-0" />
                                                <span>{time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HugeiconsIcon icon={Location01Icon} className="h-4 w-4 shrink-0" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
