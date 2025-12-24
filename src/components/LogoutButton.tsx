'use client';

import posthog from 'posthog-js';
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // Capture logout event before resetting
        posthog.capture('user_logged_out');
        posthog.reset();

        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth');
    };

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
        </button>
    );
}
