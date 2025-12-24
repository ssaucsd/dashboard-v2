import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Home, MusicNoteSquare02Icon, Calendar, Book } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { getIsAdmin } from "@/lib/queries"

const userActions = [
  {
    label: "Home",
    icon: Home,
    href: "/"
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events"
  },
  {
    label: "Resources",
    icon: Book,
    href: "/resources"
  }
]

const adminActions = [
  {
    label: "Admin",
    icon: Home,
    href: "/admin"
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/admin/events"
  },
  {
    label: "Resources",
    icon: Book,
    href: "/admin/resources"
  }
]

export async function AppSidebar() {
  const isAdmin = await getIsAdmin();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={MusicNoteSquare02Icon} />
          <div className="font-bold text-lg group-data-[collapsible=icon]:hidden">SSA at UCSD</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <Link href={action.href} className="w-full">
                    <SidebarMenuButton tooltip={action.label} className="cursor-pointer w-full">
                      <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                      <span>{action.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminActions.map((action) => (
                  <SidebarMenuItem key={action.label}>
                    <Link href={action.href} className="w-full">
                      <SidebarMenuButton tooltip={action.label} className="cursor-pointer w-full">
                        <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                        <span>{action.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>)}

      </SidebarContent>
    </Sidebar>
  )
}