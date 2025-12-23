"use client"

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceGrid } from "@/components/ResourceGrid";
import { type Tag, type ResourceWithTags } from "@/lib/queries";

export function ResourcesClient({
    tags,
    resources
}: {
    tags: Tag[],
    resources: ResourceWithTags[]
}) {
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

    const filteredResources = useMemo(() => {
        if (!selectedTagId) return resources;

        return resources.filter(resource =>
            resource.tags.some(tag => tag.id === selectedTagId)
        );
    }, [resources, selectedTagId]);

    return (
        <div className="space-y-6">
            <Tabs
                value={selectedTagId || "all"}
                onValueChange={(value) => setSelectedTagId(value === "all" ? null : value)}
            >
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {tags.map((tag) => (
                        <TabsTrigger key={tag.id} value={tag.id}>
                            {tag.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <ResourceGrid resources={filteredResources} />
        </div>
    );
}
