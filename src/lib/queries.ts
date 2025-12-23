import 'server-only';

import { createClient } from "./supabase/server";
import { Tables } from "./types/database.types";

export type Event = Tables<'events'>;

export const getFirstName = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single();
        
    return profile?.first_name;
}

export const getIsAdmin = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
    return profile?.role === 'admin';
}

export const getEvents = async (): Promise<Event[] | null> => {
    const supabase = await createClient();
    const { data: events } = await supabase.from('events').select('*').order('start_time', { ascending: true });
    return events;
}

export const getUpcomingEvents = async (): Promise<Event[] | null> => {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', now)
        .order('start_time', { ascending: true });
    return events;
}

export type Resource = Tables<'resources'>;
export type Tag = Tables<'tags'>;
export type ResourceWithTags = Resource & {
    tags: Tag[];
};

export const getResources = async (): Promise<Resource[] | null> => {
    const supabase = await createClient();
    const { data: resources } = await supabase
        .from('resources')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('name', { ascending: true });
    return resources;
}

export const getPinnedResources = async (): Promise<Resource[] | null> => {
    const supabase = await createClient();
    const { data: resources } = await supabase
        .from('resources')
        .select('*')
        .eq('is_pinned', true)
        .order('name', { ascending: true });
    return resources;
}

/**
 * Get all tags ordered by display_order
 */
export const getTags = async (): Promise<Tag[] | null> => {
    const supabase = await createClient();
    const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });
    return tags;
}

/**
 * Get all resources with their tags
 */
export const getResourcesWithTags = async (): Promise<ResourceWithTags[] | null> => {
    const supabase = await createClient();

    const { data: resources } = await supabase
        .from('resources')
        .select(`
            *,
            resource_tags(
                tags(*)
            )
        `)
        .order('is_pinned', { ascending: false })
        .order('name', { ascending: true });

    // Transform nested structure to flat array of tags
    return resources?.map(resource => ({
        ...resource,
        tags: resource.resource_tags?.map((rt: { tags: Tag | null }) => rt.tags).filter(Boolean) as Tag[] || []
    })) || null;
}