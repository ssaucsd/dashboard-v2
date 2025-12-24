import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { PostHogIdentifier } from "@/components/PostHogIdentifier";
import { getUserProfile, getIsAdmin } from "@/lib/queries";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserProfile();
    const isAdmin = await getIsAdmin();

    return (
        <SidebarProvider>
            {user && (
                <PostHogIdentifier
                    userId={user.id}
                    email={user.email}
                    preferredName={user.preferred_name}
                    firstName={user.first_name}
                    isAdmin={isAdmin}
                />
            )}
            <AppSidebar />
            <main className="flex-1 w-full">
                <header className="fixed top-0 z-10 flex w-full h-14 shrink-0 items-center gap-2 px-4 border-b bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <DynamicBreadcrumb />
                </header>
                <div className="p-4 pt-16">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
