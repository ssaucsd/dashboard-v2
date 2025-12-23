import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const auth = supabase.auth;
    const { data: { session } } = await auth.getSession();

    if (!session) {
        redirect('/auth');
    }

    return (
        <>{children}</>
    );
}
