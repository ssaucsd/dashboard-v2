import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const mockEvents = [
    {
        id: 1,
        title: "Event 1",
        location: "Location 1",
        time: "January 15, 2025 at 6:00 PM",
        description: "Event 1 description",
    },
    {
        id: 2,
        title: "Event 2",
        location: "Location 2",
        time: "January 22, 2025 at 7:00 PM",
        description: "Event 2 description",
    },
    {
        id: 3,
        title: "Event 3",
        location: "Location 3",
        time: "February 1, 2025 at 5:30 PM",
        description: "Event 3 description",
    },
];

const mockResources = [
    {
        id: 1,
        title: "Resource 1",
        href: "#",
        time: "January 15, 2025 at 6:00 PM",
    },
    {
        id: 2,
        title: "Resource 2",
        href: "#",
        time: "January 22, 2025 at 7:00 PM",
    },
    {
        id: 3,
        title: "Resource 3",
        href: "#",
        time: "February 1, 2025 at 5:30 PM",
    },
];

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen w-full p-4 gap-8">
            <h1 className="text-4xl font-serif">
                Welcome to SSA, User.
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 grid-rows-[auto,1fr]">
                <Card className="col-span-1 lg:col-span-2 w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
                            Upcoming Events
                            <Link href="/events" className="text-base text-muted-foreground font-sans flex items-center gap-1">
                                View All
                                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {mockEvents.map((event) => (
                            <Card key={event.id} className="basis-[calc(50%-6px)]">
                                <CardHeader>
                                    <CardTitle className="text-lg font-serif">
                                        {event.title}
                                    </CardTitle>
                                    <CardDescription className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={MapPin} width={16} height={16} />
                                            <div>{event.location}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={Calendar} width={16} height={16} />
                                            <div>{event.time}</div>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>{event.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
                <Card className="col-span-1 w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
                            Resources
                            <Link href="/resources" className="text-base text-muted-foreground font-sans flex items-center gap-1">
                                View All
                                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {mockResources.map((resource) => (
                            <Card key={resource.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg font-serif hover:text-primary transition-colors transition-duration-300">
                                        <Link href={resource.href}>
                                            {resource.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={Calendar} width={16} height={16} />
                                            <div>{resource.time}</div>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif">
                            RSVP
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No RSVPs available.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}