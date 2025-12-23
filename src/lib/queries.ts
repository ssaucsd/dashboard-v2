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

export const getEvents = async (): Promise<Event[] | null> => {
    const supabase = await createClient();
    const { data: events } = await supabase.from('events').select('*').order('start_time', { ascending: true });
    return events;
}