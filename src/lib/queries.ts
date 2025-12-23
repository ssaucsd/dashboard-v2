import 'server-only';

import { createClient } from "./supabase/server";

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