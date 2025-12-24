import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedDate } from "@/components/formatted-date";
import {
  Calendar,
  MapPin,
  ArrowRight01Icon,
  Clock,
  Book,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  getFirstName,
  getUpcomingEvents,
  getPinnedResources,
} from "@/lib/queries";

export default async function Page() {
  const firstName = await getFirstName();
  const events = await getUpcomingEvents();
  const resources = await getPinnedResources();

  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-8">
      <h1 className="text-4xl font-serif">Welcome to SSA, {firstName}.</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 grid-rows-[auto,1fr]">
        <Card className="col-span-1 lg:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
              Upcoming Events
              <Link
                href="/events"
                className="text-base text-muted-foreground font-sans flex items-center gap-1"
              >
                View All
                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {events && events.length > 0 ? (
              events.map((event) => (
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
                        <FormattedDate dateString={event.start_time} />
                      </div>
                    </CardDescription>
                  </CardHeader>
                  {event.description && (
                    <CardContent>
                      <p>{event.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                  <HugeiconsIcon
                    icon={Calendar}
                    width={32}
                    height={32}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  No Upcoming Events
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  There are no events scheduled at the moment. Check back soon!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
              Resources
              <Link
                href="/resources"
                className="text-base text-muted-foreground font-sans flex items-center gap-1"
              >
                View All
                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif hover:text-primary transition-colors transition-duration-300">
                      <Link href={resource.link}>{resource.name}</Link>
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock} width={16} height={16} />
                        <FormattedDate
                          dateString={resource.created_at}
                          showTime={false}
                        />
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                  <HugeiconsIcon
                    icon={Book}
                    width={32}
                    height={32}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  No Pinned Resources
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Important resources will be pinned here for quick access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No RSVPs available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
