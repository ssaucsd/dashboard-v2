'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getIsAdmin } from '@/lib/queries';

export type ActionResult = {
    success: boolean;
    error?: string;
};

export async function createResource(formData: FormData): Promise<ActionResult> {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string | null;
    const isPinned = formData.get('is_pinned') === 'on';

    if (!name || !link) {
        return { success: false, error: 'Name and link are required' };
    }

    const supabase = await createClient();
    const { error } = await supabase.from('resources').insert({
        name,
        link,
        description: description || null,
        is_pinned: isPinned,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    revalidatePath('/');
    return { success: true };
}

export async function updateResource(id: string, formData: FormData): Promise<ActionResult> {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string | null;
    const isPinned = formData.get('is_pinned') === 'on';

    if (!name || !link) {
        return { success: false, error: 'Name and link are required' };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from('resources')
        .update({
            name,
            link,
            description: description || null,
            is_pinned: isPinned,
        })
        .eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    revalidatePath('/');
    return { success: true };
}

export async function deleteResource(id: string): Promise<ActionResult> {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();
    const { error } = await supabase.from('resources').delete().eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    revalidatePath('/');
    return { success: true };
}
