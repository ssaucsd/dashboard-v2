import { Card, CardContent } from "@/components/ui/card";
import { FormattedDate } from "@/components/formatted-date";
import { Calendar, MapPin, Clock } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getUpcomingEvents } from "@/lib/queries";
import Image from "next/image";

export default async function EventsPage() {
    const events = await getUpcomingEvents();

    return (
        <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-serif">Upcoming Events</h1>
                <p className="text-muted-foreground text-lg">
                    Discover what&apos;s happening next with SSA
                </p>
            </div>

            {!events || events.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted p-4">
                            <HugeiconsIcon icon={Calendar} className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No upcoming events</h3>
                            <p className="text-muted-foreground">
                                Check back soon for new events!
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const startDate = new Date(event.start_time);
                        const endDate = new Date(event.end_time);

                        // Format duration
                        const isSameDay = startDate.toDateString() === endDate.toDateString();

                        return (
                            <Card
                                key={event.id}
                                className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                            >
                                {/* Event Image */}
                                <div className="relative aspect-video overflow-hidden bg-linear-to-br from-primary/20 to-primary/5">
                                    {event.image_url ? (
                                        <Image
                                            src={event.image_url}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <div className="text-5xl font-bold text-primary/30">
                                                    {startDate.getDate()}
                                                </div>
                                                <div className="text-lg uppercase tracking-wider text-primary/50">
                                                    {startDate.toLocaleString('default', { month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Date Badge */}
                                    <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
                                        <div className="text-center">
                                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                                {startDate.toLocaleString('default', { month: 'short' })}
                                            </div>
                                            <div className="text-2xl font-bold text-foreground leading-none">
                                                {startDate.getDate()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-serif font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>

                                        {event.description && (
                                            <p className="text-muted-foreground text-sm line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-border/50">
                                        {/* Time */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <HugeiconsIcon icon={Clock} className="h-4 w-4 shrink-0" />
                                            <span>
                                                {isSameDay ? (
                                                    <>
                                                        <FormattedDate dateString={event.start_time} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FormattedDate dateString={event.start_time} /> - <FormattedDate dateString={event.end_time} />
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <HugeiconsIcon icon={MapPin} className="h-4 w-4 shrink-0" />
                                            <span className="line-clamp-1">{event.location}</span>
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
