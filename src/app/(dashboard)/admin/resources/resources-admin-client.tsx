"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Resource } from "@/lib/queries";
import { ResourceFormDialog, EditResourceButton } from "@/components/ResourceFormDialog";
import { DeleteResourceDialog } from "@/components/DeleteResourceDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon, PinIcon, File01Icon } from "@hugeicons/core-free-icons";

interface ResourcesAdminClientProps {
    resources: Resource[];
}

export function ResourcesAdminClient({ resources }: ResourcesAdminClientProps) {
    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">
                        {resources.length} resource{resources.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <ResourceFormDialog />
            </div>

            {/* Resources List */}
            {resources.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted p-4">
                            <HugeiconsIcon icon={File01Icon} className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No resources yet</h3>
                            <p className="text-muted-foreground">
                                Add your first resource to get started.
                            </p>
                        </div>
                        <ResourceFormDialog />
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {resources.map((resource) => (
                        <Card key={resource.id} className="p-0 overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Resource Info */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                                            <HugeiconsIcon
                                                icon={resource.is_pinned ? PinIcon : Link01Icon}
                                                className={`h-5 w-5 text-primary ${resource.is_pinned ? 'rotate-45' : ''}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold truncate">
                                                    {resource.name}
                                                </h3>
                                                {resource.is_pinned && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Pinned
                                                    </Badge>
                                                )}
                                            </div>
                                            <a
                                                href={resource.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary truncate block"
                                            >
                                                {resource.link}
                                            </a>
                                            {resource.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <EditResourceButton resource={resource} />
                                        <DeleteResourceDialog
                                            resourceId={resource.id}
                                            resourceName={resource.name}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
